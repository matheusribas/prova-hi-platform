import '@testing-library/jest-dom';
import { act, render, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { Node } from "../../components/Node";
import { DataType } from '../../types/DataType';
import { StatusCheckboxType } from '../../types/StatusCheckboxType';
import { ReactNode } from 'react';
import { NodeProvider } from '../../context/Nodes';
import { StatusCheckboxProvider } from '../../context/StatusCheckbox';

describe("<Node />", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <NodeProvider>
      <StatusCheckboxProvider>
        {children}
      </StatusCheckboxProvider>
    </NodeProvider>
  )

  const nodes = {
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
          return JSON.stringify(nodes);
        default:
          return null;
      }
    })

  it("should render the nodes", () => {
    const { getByText } = render(<Node node={nodes} />, { wrapper })
    
    expect(getByText("Matheus Felipe")).toBeInTheDocument()
    expect(getByText("Noah Ribas")).toBeInTheDocument()
    expect(getByText("Ronaldo Ribas")).toBeInTheDocument()
    expect(getByText("Emma Ribas")).toBeInTheDocument()
  })
  
  it("should expand the child checkboxes" , async () => {
    const { getByRole, getByTestId } = render(<Node node={nodes} />, { wrapper })
    const nodeId = 'test-1'
    
    const button = getByRole('button', { name: `buttonOpenAccordion-${nodeId}` })
    const listCheckboxesChild = getByTestId(`listCheckboxesChild-${nodeId}`)

    userEvent.click(button)
    
    await waitFor(() => {
      expect(listCheckboxesChild).toHaveStyle({ display: 'block' })
    });
  })

  it("should change the checked status of the checkbox to true" , async () => {
    const { getByRole } = render(<Node node={nodes} />, { wrapper })
    const nodeId = 'test-1'
    
    const inputCheckbox = getByRole("checkbox", { name: `checkbox-${nodeId}` })

    userEvent.click(inputCheckbox)

    await waitFor(() => {
      expect(inputCheckbox).toBeChecked();
    });
  })

  it("should change the checked status of the children's checkbox to true when checkbox parent to true" , async () => {
    const { getByRole } = render(<Node node={nodes} />, { wrapper })
    const parentId = 'test-1'
    const child1Id = 'test-child-1'
    const child2Id = 'test-child-2'
    
    const inputCheckboxParent = getByRole("checkbox", { name: `checkbox-${parentId}` })
    const inputCheckboxChild1 = getByRole("checkbox", { name: `checkbox-${child1Id}` })
    const inputCheckboxChild2 = getByRole("checkbox", { name: `checkbox-${child2Id}` })

    userEvent.click(inputCheckboxParent)
    
    await waitFor(() => {
      expect(inputCheckboxParent).toBeChecked()
      expect(inputCheckboxChild1).toBeChecked()
      expect(inputCheckboxChild2).toBeChecked()
    });
  })
  
  it("should change the checked status of the parent's checkbox to true when all children are true" , async () => {
    const { getByRole } = render(<Node node={nodes} />, { wrapper })
    const parentId = 'test-1'
    const child1Id = 'test-child-1'
    const child2Id = 'test-child-2'
    
    const inputCheckboxChild1 = getByRole("checkbox", { name: `checkbox-${child1Id}` })
    const inputCheckboxChild2 = getByRole("checkbox", { name: `checkbox-${child2Id}` })
    const inputCheckboxParent = getByRole("checkbox", { name: `checkbox-${parentId}` })

    act(() => {
      userEvent.click(inputCheckboxChild1);
      userEvent.click(inputCheckboxChild2);
    })

    await waitFor(() => {
      expect(inputCheckboxParent).toBeChecked()
    });
  })
})