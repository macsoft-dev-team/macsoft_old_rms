import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-github';

export default function AddressValueAceEditor({ value, onChange }) {
    return (
        <AceEditor
            mode="text"
            theme="github"
            name="address_value_ace_editor"
            width="100%"
            height="200px"
            fontSize={14}
            value={value}
            onChange={onChange}
            setOptions={{
                showLineNumbers: true,
                tabSize: 2,
                useWorker: false,
            }}
            editorProps={{ $blockScrolling: true }}
        />
    );
}
