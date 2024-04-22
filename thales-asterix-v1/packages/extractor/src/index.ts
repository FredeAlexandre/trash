import { Workbook, type Worksheet } from "exceljs"
import { getFakeBorderTables } from "./utils"

export * from "./utils"

export function getAuthorTable(workbook: Workbook) {
  const worksheet_id = 0;
  const worksheet = workbook.worksheets[worksheet_id]

  if (!worksheet) {
    throw new Error("The worksheet for author table is not found")
  }

  const tables = getFakeBorderTables(worksheet)
  if (tables.length != 2) {
    throw new Error("We found " + tables.length + " tables instead of 2")
  }

  return { ...tables[0], worksheet_id }
}

export function getRevisionTable(workbook: Workbook) {
  const worksheet_id = 2;
  const worksheet = workbook.worksheets[worksheet_id]

  if (!worksheet) {
    throw new Error("The worksheet for revision table is not found")
  }

  const tables = getFakeBorderTables(worksheet)
  if (tables.length != 1) {
    throw new Error("We found " + tables.length + " tables instead of 1")
  }

  return {...tables[0], worksheet_id}
}

export function getImaTable(worksheet: Worksheet, length: number) {
  const tables = getFakeBorderTables(worksheet)
  if (tables.length != length) {
    throw new Error("We found " + tables.length + " tables instead of " + length)
  }

  const top = Math.min(...tables.map(({top}) => top))
  const bottom = Math.max(...tables.map(({bottom}) => bottom))
  const right = Math.min(...tables.map(({right}) => right))
  const left = Math.max(...tables.map(({left}) => left))

  return {
    top,
    bottom,
    right,
    left
  }
}

export function getSoftwareDevelopmentTable(workbook: Workbook) {
  const worksheet_id = 4;
  const worksheet = workbook.worksheets[worksheet_id]

  if (!worksheet) {
    throw new Error("The worksheet for software development table is not found")
  }

  return {...getImaTable(worksheet, 3), worksheet_id}
}

export function getModuleIntegratorTable(workbook: Workbook) {
  const worksheet_id = 5;
  const worksheet = workbook.worksheets[worksheet_id]

  if (!worksheet) {
    throw new Error("The worksheet for module integrator table is not found")
  }

  const tables = getFakeBorderTables(worksheet)
  tables.pop()
  if (tables.length != 6) {
    throw new Error("We found " + tables.length + " tables instead of 7")
  }

  const top = Math.min(...tables.map(({top}) => top))
  const bottom = Math.max(...tables.map(({bottom}) => bottom))
  const right = Math.min(...tables.map(({right}) => right))
  const left = Math.max(...tables.map(({left}) => left))

  return {
    top,
    bottom,
    right,
    left,
    worksheet_id
  }
}

export function getSoftwateTable(workbook: Workbook) {
  const worksheet_id = 6;
  const worksheet = workbook.worksheets[worksheet_id]

  if (!worksheet) {
    throw new Error("The worksheet for software table is not found")
  }

  return {...getImaTable(worksheet, 1), worksheet_id}
}

export function getToolsTable(workbook: Workbook) {
  const worksheet_id = 7;
  const worksheet = workbook.worksheets[worksheet_id]

  if (!worksheet) {
    throw new Error("The worksheet for tools table is not found")
  }

  return {...getImaTable(worksheet, 1), worksheet_id}
}

export function getPartNumberTable(workbook: Workbook) {
  const worksheet_id = 8;
  const worksheet = workbook.worksheets[worksheet_id]

  if (!worksheet) {
    throw new Error("The worksheet for part number table is not found")
  }

  return {...getImaTable(worksheet, 3), worksheet_id}
}
