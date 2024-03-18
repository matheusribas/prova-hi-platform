import '@testing-library/jest-dom';
import { render } from "@testing-library/react";
import { Tree } from "../../components/Tree";
import * as useNodes from "../../hooks/useNodes";

jest.mock('../../hooks/useNodes', () => {
  return {
    __esModule: true,
    ...jest.requireActual('../../hooks/useNodes')
  };
});

describe("<Tree />", () => {
  it("should render the tree with one node", () => {
    jest
      .spyOn(useNodes, 'useNodes')
      .mockReturnValue({
        nodes: {
          "0": {
            id: "test-1",
            name: "Matheus Felipe",
            children: {},
            level: 0
          }
        },
        isLoading: false
      })

    const { getByText } = render(<Tree />)
    
    expect(getByText("Matheus Felipe")).toBeInTheDocument()
  })

  it("should render component Loading", () => {
    jest
      .spyOn(useNodes, 'useNodes')
      .mockReturnValue({
        nodes: {},
        isLoading: true
      })

    const { getByTestId } = render(<Tree />)
    
    expect(getByTestId("loading")).toBeInTheDocument();
  })

  it("should render component Error", () => {
    jest
      .spyOn(useNodes, 'useNodes')
      .mockReturnValue({
        nodes: {},
        isLoading: false
      })

    const { getByTestId } = render(<Tree />)
    
    expect(getByTestId("error")).toBeInTheDocument();
  })
})