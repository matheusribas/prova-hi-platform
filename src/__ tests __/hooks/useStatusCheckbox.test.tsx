import { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useStatusCheckbox } from "../../hooks/useStatusCheckbox";
import { StatusCheckboxProvider } from "../../context/StatusCheckbox";
import { StatusCheckboxType } from "../../types/StatusCheckboxType";
import { NodeProvider } from "../../context/Nodes";
import { DataType } from "../../types/DataType";
import { useNodes } from "../../hooks/useNodes";

describe("useStatusCheckbox", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NodeProvider>
      <StatusCheckboxProvider>
      {children}
      </StatusCheckboxProvider>
    </NodeProvider>
  );
  
  const nodeAdded = {
    "0": {
      id: "test-1",
      name: "Matheus Felipe",
      children: {
        "0": {
          id: "test-child-1",
          name: "Noah Ribas",
          children: {
            "0": {
              id: "test-grandchild-1",
              name: "Ronaldo Ribas",
              children: {},
              level: 2,
            },
          },
          level: 1,
        },
        "1": {
          id: "test-child-2",
          name: "Emma Ribas",
          children: {},
          level: 1,
        },
      },
      level: 0,
    }
  } as DataType

  const checkboxesAdded = {
    "test-1": {
      checked: false,
      indeterminate: false
    },
    "test-child-1": {
      checked: false,
      indeterminate: false
    },
    "test-child-2": {
      checked: false,
      indeterminate: false
    },
    "test-grandchild-1": {
      checked: false,
      indeterminate: false
    },
  } as StatusCheckboxType
  
  jest
    .spyOn(Storage.prototype, 'getItem')
    .mockImplementation(key => {
      switch (key) {
        case '@hi-platform:checkboxes':
          return JSON.stringify(checkboxesAdded);
        case '@hi-platform:nodes':
          return JSON.stringify(nodeAdded);
        default:
          return null;
      }
    });
  
  it("should get the status of checkboxes from localStorage" , async () => {
    const { result } = renderHook(() => useStatusCheckbox(), { wrapper });

    await waitFor(() => {
      expect(result.current.statusCheckbox["test-1"]).not.toBe(undefined);
    });
  })

  it("should change the checked status of the checkbox to true" , async () => {
    const { result } = renderHook(() => useStatusCheckbox(), { wrapper });
    
    act(() => {
      result.current.onChangeStatusCheckbox({
        nodeCurrent: {
          id: "test-1",
          name: "Matheus Felipe",
          children: {},
          level: 0,
        },
        brothers: {}
      })
    });

    await waitFor(() => {
      expect(result.current.statusCheckbox["test-1"].checked).toBe(true);
    });
  })

  it("should change the checked status of the children's checkbox to true when checkbox parent to true" , async () => {
    const { result } = renderHook(() => useStatusCheckbox(), { wrapper });
    
    act(() => {
      result.current.onChangeStatusCheckbox({
        nodeCurrent: {
          id: "test-1",
          name: "Matheus Felipe",
          children: {
            "0": {
              id: "test-child-1",
              name: "Noah Ribas",
              children: {},
              level: 1,
            },
            "1": {
              id: "test-child-2",
              name: "Emma Ribas",
              children: {},
              level: 1,
            },
          },
          level: 0,
        },
        brothers: {}
      })
    });

    await waitFor(() => {
      expect(result.current.statusCheckbox["test-child-1"].checked).toBe(true);
      expect(result.current.statusCheckbox["test-child-2"].checked).toBe(true);
    });
  })

  it("should change the checked status of the parent's checkbox to true when all children are true" , async () => {
    const { result: resultNodes } = renderHook(() => useNodes(), { wrapper });
    const { result } = renderHook(() => useStatusCheckbox(), { wrapper });
    
    await waitFor(() => {
      expect(resultNodes.current.nodes[0].name).toEqual("Matheus Felipe");
    });
    
    act(() => {
      result.current.onChangeStatusCheckbox({
        nodeCurrent: {
          id: "test-child-1",
          name: "Noah Ribas",
          children: {},
          level: 1,
        },
        brothers: {
          "0": {
            id: "test-child-2",
            name: "Emma Ribas",
            children: {},
            level: 1,
          }
        }
      })
      result.current.onChangeStatusCheckbox({
        nodeCurrent: {
          id: "test-child-2",
          name: "Emma Ribas",
          children: {},
          level: 1,
        },
        brothers: {
          "0": {
            id: "test-child-1",
            name: "Noah Ribas",
            children: {},
            level: 1,
          }
        }
      })
    });

    await waitFor(() => {
      expect(result.current.statusCheckbox["test-1"].checked).toBe(true);
    });
  })

  it("should change the indeterminate status of the parent's checkbox to true when some children checked status are true" , async () => {
    const { result: resultNodes } = renderHook(() => useNodes(), { wrapper });
    const { result } = renderHook(() => useStatusCheckbox(), { wrapper });
    
    await waitFor(() => {
      expect(resultNodes.current.nodes[0].name).toEqual("Matheus Felipe");
    });
    
    act(() => {
      result.current.onChangeStatusCheckbox({
        nodeCurrent: {
          id: "test-child-1",
          name: "Noah Ribas",
          children: {},
          level: 1
        },
        brothers: {
          "0": {
            id: "test-child-1",
            name: "Noah Ribas",
            children: {},
            level: 1
          },
          "1": {
            id: "test-child-2",
            name: "Emma Ribas",
            children: {},
            level: 1
          }
        }
      })
    });

    await waitFor(() => {
      expect(result.current.statusCheckbox["test-1"].indeterminate).toBe(true);
    });
  })

  it("should change the indeterminate status of the parent's checkbox to true when some children indeterminate status are true" , async () => {
    const { result: resultNodes } = renderHook(() => useNodes(), { wrapper });
    const { result } = renderHook(() => useStatusCheckbox(), { wrapper });
    
    await waitFor(() => {
      expect(resultNodes.current.nodes[0].name).toEqual("Matheus Felipe");
    });
    
    act(() => {
      result.current.onChangeStatusCheckbox({
        nodeCurrent: {
          id: "test-grandchild-1",
          name: "Ronaldo Ribas",
          children: {},
          level: 2,
        },
        brothers: {}
      })
    });

    await waitFor(() => {
      expect(result.current.statusCheckbox["test-1"].indeterminate).toBe(true);
    });
  })
})