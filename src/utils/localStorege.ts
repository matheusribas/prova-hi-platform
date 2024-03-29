type itemsLocalStorege = '@hi-platform:nodes' | '@hi-platform:checkboxes'

type setItem = ({ item, value }: { item: itemsLocalStorege, value: string }) => void

type getItem = <T>({ item, isJSON }: { item: itemsLocalStorege, isJSON?: boolean }) => T

const setItemLocalStorage: setItem = ({item, value}) => {
  localStorage.setItem(item, value)
}

const getItemLocalStorage : getItem = ({item, isJSON = false}) => {
  let items = localStorage.getItem(item)
  
  if (!isJSON) {
    return items
  }

  if (items) {
    try {
      return JSON.parse(items)
    } catch (error) {
      throw new Error(`O campo ${item} não é um JSON.`);
    }
  }
}

export { setItemLocalStorage, getItemLocalStorage }