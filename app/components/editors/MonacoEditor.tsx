import { Editor, useMonaco } from "@monaco-editor/react";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";

export type MonacoAutoCompletion = {
  label: string;
  kind: any;
  documentation: string;
  insertText: string;
  insertTextRules?: any;
};
interface Props {
  name?: string;
  value: string;
  onChange?: (value: string) => void;
  theme?: "vs-dark" | "light";
  hideLineNumbers?: boolean;
  language?: "javascript" | "typescript" | "html" | "css" | "json" | "markdown" | "yaml";
  fontSize?: number;
  className?: string;
  autocompletions?: MonacoAutoCompletion[];
  tabSize?: number;
}

let registerCompletion: any;

export default function MonacoEditor({ name, value, onChange, theme, hideLineNumbers, language, fontSize, className, autocompletions, tabSize = 4 }: Props) {
  const monaco = useMonaco();

  const [actualValue, setActualValue] = useState<string>(value ?? "");

  useEffect(() => {
    setActualValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (onChange) {
      onChange(actualValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualValue]);

  useEffect(() => {
    function createDependencyProposals(autocompletions: MonacoAutoCompletion[], range: any) {
      // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
      // here you could do a server side lookup
      return autocompletions.map((f) => {
        return {
          ...f,
          range: range,
        };
      });
      // return [
      //   {
      //     label: '"express"',
      //     kind: monaco.languages.CompletionItemKind.Function,
      //     documentation: "Fast, unopinionated, minimalist web framework",
      //     insertText: '"express": "*"',
      //     range: range,
      //   },
      //   {
      //     label: '"mkdirp"',
      //     kind: monaco.languages.CompletionItemKind.Function,
      //     documentation: "Recursively mkdir, like <code>mkdir -p</code>",
      //     insertText: '"mkdirp": "*"',
      //     range: range,
      //   },
      //   {
      //     label: '"my-third-party-library"',
      //     kind: monaco.languages.CompletionItemKind.Function,
      //     documentation: "Describe your library here",
      //     // eslint-disable-next-line no-template-curly-in-string
      //     insertText: '"${1:my-third-party-library}": "${2:1.2.3}"',
      //     insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      //     range: range,
      //   },
      // ];
    }

    if (monaco) {
      if (registerCompletion) {
        registerCompletion.dispose();
      }
      registerCompletion = monaco.languages.registerCompletionItemProvider("markdown", {
        provideCompletionItems: function (model: any, position: any) {
          // find out if we are completing a property in the 'dependencies' object.
          // var textUntilPosition = model.getValueInRange({
          //   startLineNumber: 1,
          //   startColumn: 1,
          //   endLineNumber: position.lineNumber,
          //   endColumn: position.column,
          // });
          // var match = textUntilPosition.match(/"dependencies"\s*:\s*\{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*([^"]*)?$/);
          // if (!match) {
          //   return { suggestions: [] };
          // }
          var word = model.getWordUntilPosition(position);
          var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return {
            suggestions: createDependencyProposals(autocompletions ?? [], range),
          };
        },
      });
    }

    return () => {
      if (registerCompletion) {
        registerCompletion.dispose();
      }
    };
  }, [autocompletions, monaco]);

  return (
    <Fragment>
      {name && <textarea hidden readOnly name={name} value={actualValue} />}
      <Editor
        loading={<div className={clsx(className)}></div>}
        theme={theme}
        className={clsx(
          className,
          "block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500 sm:text-sm",
          hideLineNumbers && "-ml-10"
        )}
        // defaultLanguage={editorLanguage}
        language={language}
        options={{
          fontSize,
          renderValidationDecorations: "off",
          wordWrap: "on",
          unusualLineTerminators: "off",
          tabSize,
        }}
        value={actualValue}
        onChange={(e) => setActualValue(e?.toString() ?? "")}
      />
    </Fragment>
  );
}
