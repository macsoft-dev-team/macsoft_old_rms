import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import Input from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Sliders, Database, AlertCircle, Key, Link2, User, Globe, Activity } from "lucide-react";

export default function SnaMappingModal({ open, onOpenChange, mapping, onSave }) {
    const isEdit = !!mapping;
    const [imeinumber, setImeinumber] = useState("");
    const [snamqtturl, setSnamqtturl] = useState("");
    const [snamqttclientid, setSnamqttclientid] = useState("");
    const [snamqttusername, setSnamqttusername] = useState("");
    const [snamqttpassword, setSnamqttpassword] = useState("");
    const [snamqttpubtopicdata, setSnamqttpubtopicdata] = useState("");
    const [snamqttsubtopiccmd, setSnamqttsubtopiccmd] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            if (mapping) {
                setImeinumber(mapping.imeinumber || "");
                setSnamqtturl(mapping.snamqtturl || "");
                setSnamqttclientid(mapping.snamqttclientid || "");
                setSnamqttusername(mapping.snamqttusername || "");
                setSnamqttpassword(mapping.snamqttpassword || "");
                setSnamqttpubtopicdata(mapping.snamqttpubtopicdata || "");
                setSnamqttsubtopiccmd(mapping.snamqttsubtopiccmd || "");
            } else {
                setImeinumber("");
                setSnamqtturl("");
                setSnamqttclientid("");
                setSnamqttusername("");
                setSnamqttpassword("");
                setSnamqttpubtopicdata("");
                setSnamqttsubtopiccmd("");
            }
            setError("");
        }
    }, [open, mapping]);

    const handleSubmit = async (e, shouldPublish = false) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!imeinumber.trim()) {
            setError("IMEI number is required");
            return;
        }
        setIsSubmitting(true);
        setError("");
        try {
            await onSave({
                imeinumber: imeinumber.trim(),
                snamqtturl: snamqtturl.trim(),
                snamqttclientid: snamqttclientid.trim(),
                snamqttusername: snamqttusername.trim(),
                snamqttpassword: snamqttpassword.trim(),
                snamqttpubtopicdata: snamqttpubtopicdata.trim(),
                snamqttsubtopiccmd: snamqttsubtopiccmd.trim(),
                snamqttsubtopiccmdresponse: snamqttsubtopiccmd.trim() ? `${snamqttsubtopiccmd.trim()}/response` : ""
            }, shouldPublish);
            onOpenChange(false);
        } catch (err) {
            setError(err.message || "Failed to save mapping");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl dark:bg-gray-900 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="dark:text-gray-100 flex tracking-wider uppercase font-medium items-center space-x-2 border-b pb-3 border-gray-200 dark:border-gray-800">
                        <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                        <span>{isEdit ? "Edit SNA Mapping" : "Create SNA Mapping"}</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-5 py-4">
                    {error && (
                        <div className="flex items-center space-x-2 p-3 text-sm text-red-600 bg-red-50 rounded dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Database className="w-4 h-4 text-gray-400" />
                                <span>Device Identity</span>
                            </div>
                            <Input
                                id="imeinumber"
                                value={imeinumber}
                                onChange={(e) => setImeinumber(e.target.value)}
                                disabled={isEdit}
                                placeholder="e.g. 860710089519253"
                                className="font-mono mt-1"
                                required
                            />
                        </div>

                        <div className="space-y-1 sm:col-span-2 border-t pt-4 border-gray-100 dark:border-gray-800">
                            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <span>SNA MQTT Broker Settings</span>
                            </div>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <Input
                                label="SNA Broker URL"
                                id="snamqtturl"
                                value={snamqtturl}
                                onChange={(e) => setSnamqtturl(e.target.value)}
                                placeholder="e.g. mqtts://pmkrms.hareda.gov.in:443"
                                className="font-sans"
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="SNA Username"
                                id="snamqttusername"
                                value={snamqttusername}
                                onChange={(e) => setSnamqttusername(e.target.value)}
                                placeholder="e.g. 860710089519253$standalonesolarpump$28"
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="SNA Password"
                                id="snamqttpassword"
                                value={snamqttpassword}
                                onChange={(e) => setSnamqttpassword(e.target.value)}
                                type="text"
                                placeholder="e.g. 8c57c689"
                            />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <Input
                                label="SNA Client ID"
                                id="snamqttclientid"
                                value={snamqttclientid}
                                onChange={(e) => setSnamqttclientid(e.target.value)}
                                placeholder="e.g. d:860710089519253$standalonesolarpump$28 (falls back to username default if empty)"
                                className="font-sans"
                            />
                        </div>

                        <div className="space-y-1 sm:col-span-2 border-t pt-4 border-gray-100 dark:border-gray-800">
                            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Activity className="w-4 h-4 text-gray-400" />
                                <span>Topic Configuration</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="SNA Pub Topic Data"
                                id="snamqttpubtopicdata"
                                value={snamqttpubtopicdata}
                                onChange={(e) => setSnamqttpubtopicdata(e.target.value)}
                                placeholder="e.g. device/snapubTopicData"
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="SNA Sub Topic Cmd"
                                id="snamqttsubtopiccmd"
                                value={snamqttsubtopiccmd}
                                onChange={(e) => setSnamqttsubtopiccmd(e.target.value)}
                                placeholder="e.g. device/snasubTopicCmd"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white min-w-[100px]"
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                        {isEdit && (
                            <Button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white min-w-[130px]"
                            >
                                {isSubmitting ? "Saving & Publishing..." : "Save & Publish"}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
