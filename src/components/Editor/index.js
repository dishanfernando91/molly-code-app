import React, { useState, useEffect, useCallback } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import axios from "axios";
import Select from "react-select";
import Output from "../Output";
import classNames from "./Editor.module.scss";

function Editor() {
  const [code, setCode] = useState();
  const [languages, setLanguages] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedLan, setSelectedLan] = useState();
  const [outputData, setOutputData] = useState();

  useEffect(() => {
    setLoading(true);
  }, [languages]);

  useEffect(() => {
    getLanguages();
    console.log("languages loaded");
  }, [loading]);

  const { editor, buttons, container, selectors, button } = classNames;
  const url = `https://rz9yx3ydl1.execute-api.us-east-1.amazonaws.com/prod/`;

  const onChange = useCallback((value) => {
    setCode(value);
  }, []);

  // let newCode = code && code.replace(/\n/g, "\n");
  // console.log("new code", newCode);

  const compileCode = async () => {
    console.log("compiling...", code);
    await axios
      .post(
        `${url}languages/${selectedLan}/latest`,
        { content: code },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
        }
      )
      .then((res) => {
        setOutputData(res.data.stdout);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLanguages = async () => {
    await axios
      .get(`${url}languages`)
      .then((res) => {
        setLanguages(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const languageOptions = () => {
    let options;
    if (languages) {
      options = languages.data.map((lan) => {
        return {
          value: lan.name,
          label: `${lan.name[0].toUpperCase()}${lan.name
            .slice(1)
            .toLowerCase()}`,
        };
      });
      return options;
    }
  };

  const handleChange = (language) => {
    setSelectedLan(language.value);
  };

  console.log(code);

  return (
    <div className={container}>
      <div className={selectors}>
        <Select
          placeholder={selectedLan || "Select Language"}
          value={selectedLan}
          onChange={handleChange}
          options={languageOptions()}
        />
        <div className={buttons}>
          <button onClick={compileCode} className={button}>
            Run
          </button>
          <button className={button} disabled={true}>
            Expand
          </button>
        </div>
      </div>
      <div className={editor}>
        <AceEditor
          placeholder="console.log('Hello, world!)"
          mode={selectedLan ? "javascript" : selectedLan}
          theme="monokai"
          onChange={onChange}
          name="questions_editor"
          editorProps={{ $blockScrolling: true }}
          highlightActiveLine
          wrapEnabled={true}

          // tabSize={2}
          // setOptions={{
          //   enableBasicAutocompletion: true,
          //   enableLiveAutocompletion: true,
          //   enableSnippets: true,
          // useSoftTabs: true,
          // }}
        />
      </div>
      <Output data={outputData} />
    </div>
  );
}

export default Editor;
