import { Workbook, type Worksheet, type Cell, type CellValue } from "exceljs"

/**
 * Simply return the Workbook object from "exceljs" library
 *
 * @param buffer An array buffer from nodejs file reader or browser file reader
 * @returns The workbook object
 */
export async function getWorkbook(buffer: ArrayBuffer) {
  const workbook = new Workbook()
  await workbook.xlsx.load(buffer)
  return workbook
}

/**
 * This function returns an array of array representing a row in the execel
 * This function also remove blank/undefined/null cells
 *
 * @param worksheet The worksheet we want to convert
 * @returns the array of array
 */
export function getWorksheetCells(worksheet: Worksheet) {
  const content: Cell[][] = []

  worksheet.columns.forEach((column) => {
    if (!column.eachCell) return
    const cells: Cell[] = []
    column.eachCell((cell) => {
      if (!cellHasBorder(cell) && (cell.value === undefined || cell.value === null)) return
      cells.push(cell)
    })
    if (cells.length === 0) return
    content.push(cells)
  })

  return content
}

/**
 * Return if the cell as borders or none
 *
 * @param cell The cell
 * @returns True if the cell has borders False if none
 */
export function cellHasBorder(cell: Cell) {
  return cell.border && (cell.border.top || cell.border.left || cell.border.bottom || cell.border.right || cell.border.diagonal)
}

/**
 * Check is the cells are touching from righ, left and top, bottom on the
 * worksheet
 *
 * @param cell1
 * @param cell2
 * @returns True or False
 */
export function areCellsTouching(cell1: Cell, cell2: Cell) {
  const row1 = safeNumber(cell1.row)
  const row2 = safeNumber(cell2.row)
  const col1 = safeNumber(cell1.col)
  const col2 = safeNumber(cell2.col)

  if (row1 === row2) {
    return Math.abs(col1 - col2) === 1
  }
  if (col1 === col2) {
    return Math.abs(row1 - row2) === 1
  }
  return false
}

/**
 * Check if 2 cell nodes are touching
 *
 * @param node1
 * @param node2
 * @returns True or False
 */
export function areCellNodesTouching(node1: Cell[], node2: Cell[]) {
  return node1.some((cell1) => node2.some((cell2) => areCellsTouching(cell1, cell2)))
}

/**
 * At runtime ensure value is a number or throw an error
 *
 * @param value A number as string or number
 * @returns the number
 */
export function safeNumber(value: unknown) {
  if (typeof value == "string") return parseInt(value)
  if (typeof value == "number") return value
  throw Error("Cell: " + value + " is not a number or a string")
}

export function convertCellNodeToTable(node: Cell[]) {
  const table: Cell[][] = []

  const minRow = Math.min(...node.map((cell) => safeNumber(cell.row)))
  const maxRow = Math.max(...node.map((cell) => safeNumber(cell.row)))
  const minCol = Math.min(...node.map((cell) => safeNumber(cell.col)))
  const maxCol = Math.max(...node.map((cell) => safeNumber(cell.col)))

  const width = maxCol - minCol + 1
  const height = maxRow - minRow + 1

  for (let i = 0; i < height; i++) {
    const row: Cell[] = []
    for (let j = 0; j < width; j++) {
      const cell = node.find((cell) => safeNumber(cell.row) === minRow + i && safeNumber(cell.col) === minCol + j)
      if (cell) {
        row.push(cell)
      }
    }
    if (row.length > 0) {
      table.push(row)
    }
  }

  return table
}

export function stringifyCell(value: CellValue) {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  ) {
    return `${value}`;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if ("text" in value) {
    return value.text;
  }

  if ("result" in value) {
    return `${value.result}`;
  }

  if ("richText" in value) {
    return value.richText.map((x) => x.text).join("");
  }

  return `${value}`;
}

export function getCellNodes(cells: Cell[]) {
  // A list of nodes - A node is a group of cells that are touching each other
  const nodes: Cell[][] = []

  // From all the cells with borders, we create a list of nodes
  cells.forEach((cell) => {
    const node = nodes.find((node) => node.some((nCell) => areCellsTouching(nCell, cell)))
    if (node) {
      node.push(cell)
    } else {
      nodes.push([cell])
    }
  })

  // Merging touching nodes
  let merged = true
  while (merged) {
    merged = false
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (areCellNodesTouching(nodes[i], nodes[j])) {
          nodes[i] = nodes[i].concat(nodes[j])
          nodes.splice(j, 1)
          merged = true
          break
        }
      }
      if (merged) break
    }
  }

  return nodes
}

/**
 * This function can be used to find a table in a worksheet that is "fake"
 * meaning is not proprely formatted as a table in Excel but rather a
 * visual effect with border.
 *
 * @param worksheet The worksheet where the table reside
 * @returns A list of tables within the sheet
 */
export function getFakeBorderTables(worksheet: Worksheet) {
  // Get all the cells with borders
  const content = getWorksheetCells(worksheet).map((cells) => cells.filter(cellHasBorder)).filter((cells) => cells.length > 0).flat()

  const nodes = getCellNodes(content)

  return nodes.map((node) => ({
    top: Math.min(...node.map((cell) => (safeNumber(cell.row)))),
    left: Math.min(...node.map((cell) => (safeNumber(cell.col)))),
    right: Math.max(...node.map((cell) => (safeNumber(cell.col)))),
    bottom: Math.max(...node.map((cell) => (safeNumber(cell.row)))),
  }))
}
