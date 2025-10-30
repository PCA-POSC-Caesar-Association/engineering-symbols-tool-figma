import React, { useContext, useEffect, useRef, useState } from "react";
import "./FillRuleEditor.css";

import {
  setCanvas,
  setContainer,
  updateNode,
  setOnNodeMutatedCallback,
  hasOddEvenPaths
} from "./fillRule";
import {
  SymbolContext,
  SymbolContextProviderValue,
} from "../../context/SymbolProvider";
import { SymbolVectorData } from "../../../plugin/types";
import { postMessageToPlugin } from "../../helpers/pluginHelpers";
import { InvalidSelection } from "../invalid-selection";
import { ErrorContent } from "../error-content";

export function FillRuleEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    symbol,
    validationErrors,
    isValid,
    createExportLayer,
    canCreateExportLayer,
  } = useContext(SymbolContext) as SymbolContextProviderValue;

  const onM = (nodeData: SymbolVectorData) => {
    if (!symbol || !symbol.id) return;
    postMessageToPlugin({
      type: "export-vector-network-updated",
      payload: { nodeId: symbol.id, symbolVectorData: nodeData },
    });
  };

  const draw = (vd?: SymbolVectorData) => {
    if (!vd || !containerRef.current || !canvasRef.current) return;
    updateNode(vd);
  };

  useEffect(() => {
    draw(symbol?.symbolVectorData);
  }, [symbol?.symbolVectorData]);

  useEffect(() => {
    setOnNodeMutatedCallback(onM);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    setContainer(container);
  }, [containerRef.current]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setCanvas(canvas);
    draw(symbol?.symbolVectorData);
  }, [canvasRef.current]);

  if (!symbol) return <InvalidSelection />;

  if (!symbol?.symbolVectorData)
    return (
      <ErrorContent title="Export Layer not Created">
        <button
          className={canCreateExportLayer ? "brand" : "brand-disabled"}
          disabled={!canCreateExportLayer}
          onClick={() => createExportLayer()}
        >
          Create Export Layer
        </button>
      </ErrorContent>
    );

  return (
    <>
      {hasOddEvenPaths() ?
        <div className="help-text-container odd-even-text">
          Click the odd-even paths areas marked in red to convert them to non-zero
        </div> :
        <div className="help-text-container nonzero-text">
          All paths fulfulls the non-zero rule
        </div>}
      <div ref={containerRef} id="container" className="explore">
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  );
}
