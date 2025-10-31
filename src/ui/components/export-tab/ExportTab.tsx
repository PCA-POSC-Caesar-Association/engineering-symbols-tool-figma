import React, { useContext, useEffect, useState } from "react";
import "./ExportTab.css";
import {
  SymbolContext,
  SymbolContextProviderValue,
} from "../../context/SymbolProvider";
import { postMessageToPlugin } from "../../helpers/pluginHelpers";
import { ErrorContent } from "../error-content";
import { cleanPreview } from "../../helpers/svgHelpers";
import { EsSymbolUi } from "../../../plugin/types";
import Warning from "../error-content/Warning.svg?react"

export function ExportTab() {
  const { symbol, previewSvgString, validationErrors, isValid } = useContext(
    SymbolContext
  ) as SymbolContextProviderValue;

  const [canExport, setCanExport] = useState(false);

  const [preview, setPreview] = useState<string>();
  const [fPreview, setFpreview] = useState<string>();

  const canCreateExportSymbol =
    (validationErrors.length === 1 &&
      validationErrors[0].category === "Export Layer Fill Rule") ||
    isValid;

  const updatePreview = (svgStringRaw: string, symbol: EsSymbolUi) => {
    const max = isValid ? 300 : 170;
    const { svgString, f } = cleanPreview(svgStringRaw, symbol, max);
    const percent = f * 100;
    setFpreview(percent.toFixed(0) + "%");
    setPreview(svgString);
  };

  useEffect(() => {
    if (symbol) {
      requestPreview();
    }
  }, [symbol]);

  useEffect(() => {
    setCanExport(symbol?.symbolVectorData !== undefined && isValid);
  }, [symbol?.symbolVectorData, isValid]);

  useEffect(() => {
    if (previewSvgString && symbol) {
      updatePreview(previewSvgString, symbol);
    }
  }, [previewSvgString]);

  useEffect(() => {
    if (previewSvgString && symbol) {
      updatePreview(previewSvgString, symbol);
    }
  }, [isValid]);

  const onCreate = () => {
    if (symbol === undefined || symbol.id === undefined) return;
    postMessageToPlugin({
      type: "create-export-vector",
      payload: { nodeId: symbol.id },
    });
  };

  const onExportAsSvg = () => {
    if (symbol === undefined || symbol.id === undefined) return;
    postMessageToPlugin({
      type: "create-export-blob",
      payload: { nodeId: symbol.id },
    });
  };

  const requestPreview = () => {
    if (symbol === undefined || symbol.id === undefined) return;
    postMessageToPlugin({
      type: "request-preview",
      payload: { nodeId: symbol.id },
    });
  };
  if (symbol) {
    return (
      <div className="symbolContainer">
        <div className="content">
          <div className="head">
            <h2>{symbol.name}</h2>
            {preview && <h4 className="previewHeader">Preview @ {fPreview}</h4>}
            <div className="size-container">
              <p>
                <span className="secondary-color ">W</span>&nbsp;&nbsp;
                {symbol.width}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="secondary-color ">H</span>&nbsp;&nbsp;
                {symbol.height}
              </p>

              {(symbol.width % 12 != 0 || symbol.height % 12 != 0) &&
                <div className="warning-container">
                  <Warning fill="#f24822" scale={1} strokeWidth={0} width={28} height={28} />
                  <div className="size-warning">PCA Symbol Editor requires width and height to be on a 12 mulitple</div>
                </div>}
            </div>
          </div>

          <div className="main">
            {preview && (
              <div
                className="preview"
                dangerouslySetInnerHTML={{
                  __html: preview,
                }}
              ></div>
            )}
            {validationErrors.map((e) => {
              return (
                <div className="error-item">
                  <h4>{e.category}</h4>
                  <p>{e.error}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="buttons">
          <button
            className={canCreateExportSymbol ? "brand" : "brand-disabled"}
            disabled={!canCreateExportSymbol}
            onClick={() => onCreate()}
          >
            {symbol.symbolVectorData
              ? "Re-Create Export Layer"
              : "Create Export Layer"}
          </button>

          <button
            className={canExport ? "brand" : "brand-disabled"}
            disabled={!canExport}
            onClick={() => onExportAsSvg()}
          >
            Export As SVG
          </button>
        </div>
      </div>
    );
  }

  if (validationErrors.some((e) => e.category === "Invalid Selection")) {
    return (
      <ErrorContent title="Invalid Selection">
        <p>Select a single Frame that contains a Group named 'Design'</p>
      </ErrorContent>
    );
  }

  return (
    <div>
      {validationErrors.map((e) => {
        return (
          <p>
            {e.category}: {e.error}
          </p>
        );
      })}
    </div>
  );
}
