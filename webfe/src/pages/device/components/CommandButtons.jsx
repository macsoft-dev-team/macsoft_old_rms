import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Play, StopCircle, MessageSquare, RefreshCw, Send } from 'lucide-react';
import Input from '../../../components/ui/input';
import { useCommand } from '../../../hooks/useCommand';
import { useToast } from '../../../hooks/use-toast';
import { useDevice } from '../../../hooks/useDevice';
import useTemplate from '../../../hooks/useTemplate';

const parseParameters = (str) => {
  if (!str) return [];
  if (typeof str !== 'string') {
    if (Array.isArray(str)) {
      return str.map((item) => ({
        address: item.address || '',
        value: item.value || '',
      }));
    }
    return [];
  }
  const cleaned = str.trim().replace(/^\{/, '').replace(/;?\}$/, '');
  if (!cleaned) return [];
  return cleaned
    .split(',')
    .map((part) => {
      const unquoted = part.replace(/^"|"$/g, '').trim();
      const colonIndex = unquoted.indexOf(':');
      if (colonIndex !== -1) {
        return {
          address: unquoted.substring(0, colonIndex),
          value: unquoted.substring(colonIndex + 1),
        };
      }
      return null;
    })
    .filter(Boolean);
};

const parseResponseText = (text) => {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line)
    .map(line => {
      const parts = line.split(',');
      if (parts.length >= 2) {
        return {
          address: parts[0].trim(),
          value: parts[1].trim()
        };
      }
      return null;
    })
    .filter(Boolean);
};

const CommandButtons = () => {
  const { commands, postCommand, setCommand, fetchCommands } = useCommand();
  const { device } = useDevice();
  const { toast } = useToast();
  const { templates, getTemplates } = useTemplate();

  const [customPayload, setCustomPayload] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const [parameters, setParameters] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  // Load templates on mount
  useEffect(() => {
    getTemplates({ skip: 1, take: 50, filter: '' });
  }, [getTemplates]);

  // Load first template by default
  useEffect(() => {
    if (templates && templates.length > 0 && !selectedTemplateId) {
      const defaultTemplate = templates[0];
      setSelectedTemplateId(defaultTemplate.id);
      const parsed = parseParameters(defaultTemplate.parameters);
      setParameters(parsed.map(item => ({
        name: item.address || '',
        address: item.value || '',
        readValue: '',
        writeValue: '',
        status: 'idle'
      })));
    }
  }, [templates, selectedTemplateId]);

  // Handle template change
  const handleTemplateChange = (e) => {
    const id = e.target.value;
    setSelectedTemplateId(id);
    const selected = templates.find(t => t.id === id);
    if (selected) {
      const parsed = parseParameters(selected.parameters);
      setParameters(parsed.map(item => ({
        name: item.address || '',
        address: item.value || '',
        readValue: '',
        writeValue: '',
        status: 'idle'
      })));
    }
  };

  // Poll commands every 3 seconds while active
  useEffect(() => {
    if (!device?.id) return;
    
    // Fetch immediately
    fetchCommands({ deviceId: device.id, skip: null, take: null, filter: '' });

    const interval = setInterval(() => {
      fetchCommands({ deviceId: device.id, skip: null, take: null, filter: '' });
    }, 3000);

    return () => clearInterval(interval);
  }, [device?.id, fetchCommands]);

  // Match command responses with parameters
  useEffect(() => {
    if (!commands || commands.length === 0 || parameters.length === 0) return;

    const latestValues = {};
    const sortedCommands = [...commands].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      const valA = isNaN(timeA) ? 0 : timeA;
      const valB = isNaN(timeB) ? 0 : timeB;
      return valA - valB;
    });

    sortedCommands.forEach(cmd => {
      if (cmd.type === 'RESPONSE' && cmd.response) {
        const parsed = parseResponseText(cmd.response);
        parsed.forEach(({ address, value }) => {
          latestValues[address] = {
            value,
            timestamp: cmd.createdAt
          };
        });
      }
    });

    let updated = false;
    const newParameters = parameters.map(param => {
      const match = latestValues[param.address];
      if (match) {
        if (param.readValue !== match.value || param.status === 'pending') {
          updated = true;
          return {
            ...param,
            readValue: match.value,
            status: 'success'
          };
        }
      }
      return param;
    });

    if (updated) {
      setParameters(newParameters);
    }
  }, [commands, parameters]);

  const handleSend = (type) => {
    if (!device?.id) {
      toast({
        title: "No Device Selected",
        description: "Please select a device first",
        variant: "destructive"
      });
      return;
    }

    let payload = '';
    if (type === 'MOTOR_ON') payload = '{"SRUN:1"}';
    else if (type === 'MOTOR_OFF') payload = '{"SRUN:0"}';
    else if (type === 'CUSTOM') payload = customPayload;

    if (type === 'CUSTOM' && !customPayload) {
      toast({
        title: "Payload Required",
        description: "Please enter a payload for the custom command",
        variant: "destructive"
      });
      return;
    }

    const commandData = {
      type,
      payload,
      deviceId: device.id,
      imeinumber: device.imeinumber || ''
    };

    setCommand({
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "",
      status: "pending"
    });

    try {
      postCommand(commandData);
      toast({
        title: "Command Sent",
        description: `${type === 'MOTOR_ON' ? 'Motor On' : type === 'MOTOR_OFF' ? 'Motor Off' : 'Custom'} command sent successfully`,
        variant: "success"
      });
      if (type === 'CUSTOM') setCustomPayload('');
    } catch (error) {
      toast({
        title: "Command Failed",
        description: "Failed to send command",
        variant: "destructive"
      });
    }
  };

  const handleWriteValueChange = (index, value) => {
    setParameters(prev => {
      const updated = [...prev];
      updated[index].writeValue = value;
      return updated;
    });
  };

  const handleSingleRead = (param, index) => {
    if (!device?.id) return;
    
    setParameters(prev => {
      const updated = [...prev];
      updated[index].status = 'pending';
      return updated;
    });

    const commandData = {
      type: 'VFD_READ',
      payload: `rvfd:${param.address}`,
      deviceId: device.id,
      imeinumber: device.imeinumber || ''
    };

    setCommand({
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "",
      status: "pending"
    });

    try {
      postCommand(commandData);
      toast({
        title: "Read Command Sent",
        description: `Read command for address ${param.address} sent successfully`,
        variant: "success"
      });
    } catch (error) {
      setParameters(prev => {
        const updated = [...prev];
        updated[index].status = 'error';
        return updated;
      });
      toast({
        title: "Command Failed",
        description: "Failed to send read command",
        variant: "destructive"
      });
    }
  };

  const handleSingleWrite = (param, index) => {
    if (!device?.id) return;
    if (!param.writeValue) {
      toast({
        title: "Value Required",
        description: "Please enter a write value",
        variant: "destructive"
      });
      return;
    }

    setParameters(prev => {
      const updated = [...prev];
      updated[index].status = 'pending';
      return updated;
    });

    const commandData = {
      type: 'VFD_WRITE',
      payload: `svfd:${param.address}=${param.writeValue}`,
      deviceId: device.id,
      imeinumber: device.imeinumber || ''
    };

    setCommand({
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "",
      status: "pending"
    });

    try {
      postCommand(commandData);
      toast({
        title: "Write Command Sent",
        description: `Write command for address ${param.address} sent successfully`,
        variant: "success"
      });
    } catch (error) {
      setParameters(prev => {
        const updated = [...prev];
        updated[index].status = 'error';
        return updated;
      });
      toast({
        title: "Command Failed",
        description: "Failed to send write command",
        variant: "destructive"
      });
    }
  };

  const handleReadAll = () => {
    if (!device?.id || parameters.length === 0) return;

    const addresses = parameters.map(p => p.address).join(',');
    
    setParameters(prev => prev.map(p => ({ ...p, status: 'pending' })));

    const commandData = {
      type: 'VFD_READ_ALL',
      payload: `rvfd:${addresses};`,
      deviceId: device.id,
      imeinumber: device.imeinumber || ''
    };

    setCommand({
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "",
      status: "pending"
    });

    try {
      postCommand(commandData);
      toast({
        title: "Read All Command Sent",
        description: "Bulk read command sent successfully",
        variant: "success"
      });
    } catch (error) {
      setParameters(prev => prev.map(p => ({ ...p, status: 'error' })));
      toast({
        title: "Command Failed",
        description: "Failed to send bulk read command",
        variant: "destructive"
      });
    }
  };

  const handleWriteAll = () => {
    if (!device?.id || parameters.length === 0) return;

    const modifiedParams = parameters.filter(p => p.writeValue !== '');
    if (modifiedParams.length === 0) {
      toast({
        title: "No Values Entered",
        description: "Please enter write values for at least one parameter",
        variant: "destructive"
      });
      return;
    }

    const writePayload = modifiedParams
      .map(p => `${p.address}=${p.writeValue}`)
      .join(',');

    setParameters(prev => prev.map(p => {
      if (p.writeValue !== '') {
        return { ...p, status: 'pending' };
      }
      return p;
    }));

    const commandData = {
      type: 'VFD_WRITE_ALL',
      payload: `wvfd:${writePayload};`,
      deviceId: device.id,
      imeinumber: device.imeinumber || ''
    };

    setCommand({
      id: Date.now(),
      ...commandData,
      createdAt: new Date().toISOString(),
      response: "",
      status: "pending"
    });

    try {
      postCommand(commandData);
      toast({
        title: "Write All Command Sent",
        description: "Bulk write command sent successfully",
        variant: "success"
      });
    } catch (error) {
      setParameters(prev => prev.map(p => {
        if (p.writeValue !== '') {
          return { ...p, status: 'error' };
        }
        return p;
      }));
      toast({
        title: "Command Failed",
        description: "Failed to send bulk write command",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing command buttons interface */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Device Command Interface
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Send commands to {device.name || 'selected device'} using the command buttons below.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            className="h-12"
            variant="outline"
            onClick={() => handleSend('MOTOR_ON')}
            disabled={!device.id}
          >
            <Play className="w-5 h-5 mr-2" />
            Motor On
          </Button>
          <Button
            className="h-12"
            variant="outline"
            onClick={() => handleSend('MOTOR_OFF')}
            disabled={!device.id}
          >
            <StopCircle className="w-5 h-5 mr-2" />
            Motor Off
          </Button>
          <Button
            className="h-12 col-span-2"
            variant="outline"
            onClick={() => setShowCustom((v) => !v)}
            disabled={!device.id}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Custom Command
          </Button>
        </div>
        {showCustom && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Custom Command Payload
            </label>
            <textarea
              className="w-full min-h-32 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-sm font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customPayload}
              onChange={e => setCustomPayload(e.target.value)}
              placeholder={`"SRUN:1";`}
            />
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => handleSend('CUSTOM')}
                disabled={!device.id}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700"
              >
                <span>Send</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCustomPayload('')}
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCustom(false);
                  setCustomPayload('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {!device.id && (
          <p className="text-sm text-gray-500 text-center">
            Select a device to enable command buttons
          </p>
        )}
      </div>

      {/* VFD Parameter Read/Write Screen */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              VFD Parameter Read/Write
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Read or write configuration parameters of the VFD.
            </p>
          </div>
          {templates && templates.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Template:</span>
              <select
                className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTemplateId}
                onChange={handleTemplateChange}
                disabled={!device.id}
              >
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {device.id ? (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Address</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Read Value</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Write Value</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {parameters.map((param, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{param.name}</td>
                      <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">{param.address}</td>
                      <td className="px-4 py-3">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            readOnly
                            className={`w-full rounded border px-3 py-1.5 text-sm focus:outline-none dark:bg-gray-950 dark:text-gray-100 font-mono ${
                              param.status === 'success'
                                ? 'border-green-500 bg-green-50/10 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                                : param.status === 'error'
                                ? 'border-red-500 bg-red-50/10 dark:bg-red-950/20 text-red-700 dark:text-red-400'
                                : 'border-gray-300 dark:border-gray-700'
                            }`}
                            value={param.readValue || ''}
                            placeholder="Not Read"
                          />
                          {param.status === 'pending' && (
                            <RefreshCw className="absolute right-3 w-4 h-4 text-blue-500 animate-spin" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          value={param.writeValue}
                          onChange={(e) => handleWriteValueChange(index, e.target.value)}
                          placeholder="Enter value"
                          disabled={param.status === 'pending'}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => handleSingleRead(param, index)}
                            disabled={param.status === 'pending'}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            Read
                          </Button>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => handleSingleWrite(param, index)}
                            disabled={param.status === 'pending' || !param.writeValue}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            Write
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {parameters.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No parameters defined in the selected template.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={handleReadAll}
                disabled={parameters.length === 0 || parameters.some(p => p.status === 'pending')}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Read All
              </Button>
              <Button
                variant="default"
                onClick={handleWriteAll}
                disabled={parameters.length === 0 || parameters.some(p => p.status === 'pending')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
                Write All
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            Select a device to enable parameter read/write options
          </p>
        )}
      </div>
    </div>
  );
};

export default CommandButtons;
