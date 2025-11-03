import { SymbolVectorData } from "./types";

export async function updateSymbolVectorNetwork(vectorData: SymbolVectorData) {
  const node = await figma.getNodeByIdAsync(vectorData.id);
  if (node !== null && node.type === "VECTOR") {
    await node.setVectorNetworkAsync(vectorData.vectorNetwork);
  }
}
