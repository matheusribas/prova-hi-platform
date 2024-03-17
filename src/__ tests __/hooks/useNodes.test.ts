import { renderHook, waitFor } from "@testing-library/react"

import { useNodes } from "../../hooks/useNodes";
import { NodeProvider } from "../../context/Nodes";
import { DataType } from "../../types/DataType";

describe("useNodes", () => {
  it("should get the nodes from localStorage", async () => {
    const { result } = renderHook(() => useNodes(), {
      wrapper: NodeProvider
    });
    
    const nodeAdded = {
      "0": {
        id: "test-1",
        name: "Matheus Felipe",
        children: {},
        level: 0
      }
    } as DataType
    
    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(key => {
        switch (key) {
          case '@hi-platform:nodes':
            return JSON.stringify(nodeAdded);
          default:
            return null;
        }
      });

    await waitFor(() => {
      expect(result.current.nodes[0].name)
      .toEqual("Matheus Felipe");
    });
  })
})
