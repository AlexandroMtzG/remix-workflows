import { useEffect, useState } from "react";

interface Props {
  id: string;
  type: string;
  onResponse: (response: string) => void;
  onError?: (error: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onDone?: () => void;
}
export default function PageGptStreaming({ id, type, onResponse, onError, onLoadingChange, onDone }: Props) {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // if contains ```html, then remove it
    let responseWithoutHtml = response.replace(/```html/gm, "");
    responseWithoutHtml = responseWithoutHtml.replace(/```/gm, "");
    onResponse(responseWithoutHtml);
  }, [onResponse, response]);

  useEffect(() => {
    onLoadingChange(isLoading);
  }, [onLoadingChange, isLoading]);

  useEffect(() => {
    load(id, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  const load = async (id: string, type: string) => {
    setResponse("");
    setIsLoading(true);
    const response = await fetch("/api/generate/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
      }),
    });

    if (!response.ok) {
      const jsonBody = await response.text();
      if (onError) {
        onError(response.statusText + ": " + jsonBody);
      }
      setIsLoading(false);
      return;
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      if (onError) {
        onError("No data");
      }
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResponse((prev) => prev + chunkValue);
    }
    setIsLoading(false);
    if (onDone) {
      onDone();
    }
  };

  return null;
}
