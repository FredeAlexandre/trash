import { getAuthorTable, getRevisionTable, getSoftwareDevelopmentTable, getSoftwateTable, getModuleIntegratorTable } from "@asterix/extractor";
import { Workbook, Cell, Worksheet } from "exceljs";

export function cut({worksheet, top, bottom, left, right}: {worksheet: Worksheet; top: number; bottom: number; left: number; right: number}) {
  const result: Cell[][] = []

  for (let i = top; i <= bottom; i++) {
    const x = []
    for (let j = left; j <= right; j++) {
      x.push(worksheet.getCell(i, j))
    }
    result.push(x)
  }

  return result
}

function digitalizeAuthorTable(workbook: Workbook) {
  const authors = getAuthorTable(workbook)
  const table = cut({...authors, worksheet: workbook.worksheets[authors.worksheet_id]}).slice(1)

  return table.map((x) => ({
    title: `${x[0].value}`,
    name: `${x[1].value}`,
    function: `${x[2].value}`
  }))
}

export type AuthorData = ReturnType<typeof digitalizeAuthorTable>

function digitalizeRevision(workbook: Workbook) {
  const revision = getRevisionTable(workbook)
  const table = cut({...revision, worksheet: workbook.worksheets[revision.worksheet_id]}).slice(1)

  return table.map((x) => ({
    issue: `${x[0].value}`,
    date: `${x[1].value}`,
    description: `${x[2].value}`,
    author: `${x[3].value}`
  }))
}

export type RevisionData = ReturnType<typeof digitalizeRevision>

function digitalizeSoftwareDevelopment(workbook: Workbook) {
  const revision = getSoftwareDevelopmentTable(workbook)
  const table = cut({...revision, worksheet: workbook.worksheets[revision.worksheet_id]})

  const keys = table[0].slice(4).map((cell) => ({
    name: `${cell.value}`.replaceAll("\n", " "),
    key: `${cell.value}`.replaceAll("\n", " ").replaceAll(" ", "-").toLowerCase()
  }))

  const result = table.slice(1)
    .filter((x) => {
      if (!x[1].value && !x[2].value && !x[3].value) return false
      return true
    })
    .map((x) => {
    const data: {designation: string, acronym: string, reference: string, author: string, references: Record<string, string>} = {
      designation: `${x[0].value}`,
      acronym: `${x[1].value}`,
      reference: `${x[2].value}`,
      author: `${x[3].value}`,
      references: {}
    }

    keys.forEach((k, i) => {
      data.references[k.key] = `${x[i + 4]}`
    })

    return data
  })

  return {data: result, baselines: keys}
}

export type SoftwareDevelopmentData = ReturnType<typeof digitalizeSoftwareDevelopment>

function digitalizeSoftware(workbook: Workbook) {
  const software = getSoftwateTable(workbook)
  const table = cut({...software, worksheet: workbook.worksheets[software.worksheet_id]})

  const keys = table[0].slice(4).map((cell) => ({
    name: `${cell.value}`.replaceAll("\n", " "),
    key: `${cell.value}`.replaceAll("\n", " ").replaceAll(" ", "-").toLowerCase()
  }))

  const result = table.slice(1)
    .filter((x) => {
      if (!x[1].value && !x[2].value && !x[3].value) return false
      return true
    })
    .map((x) => {
    const data: {designation: string, acronym: string, reference: string, author: string, references: Record<string, string>} = {
      designation: `${x[0].value}`,
      acronym: `${x[1].value}`,
      reference: `${x[2].value}`,
      author: `${x[3].value}`,
      references: {}
    }

    keys.forEach((k, i) => {
      data.references[k.key] = `${x[i + 4]}`
    })

    return data
  })

  return {data: result, baselines: keys}
}

export type SoftwareData = ReturnType<typeof digitalizeSoftware>

function digitalizeModuleIntegrator(workbook: Workbook) {
  const moduleIntegrator = getModuleIntegratorTable(workbook)
  const table = cut({...moduleIntegrator, worksheet: workbook.worksheets[moduleIntegrator.worksheet_id]})

  const keys = table[0].slice(4).map((cell) => ({
    name: `${cell.value}`.replaceAll("\n", " "),
    key: `${cell.value}`.replaceAll("\n", " ").replaceAll(" ", "-").toLowerCase()
  }))

  const result = table.slice(1)
    .filter((x) => {
      if (!x[1].value && !x[2].value && !x[3].value) return false
      return true
    })
    .map((x) => {
    const data: {designation: string, acronym: string, reference: string, author: string, references: Record<string, string>} = {
      designation: `${x[0].value}`,
      acronym: `${x[1].value}`,
      reference: `${x[2].value}`,
      author: `${x[3].value}`,
      references: {}
    }

    keys.forEach((k, i) => {
      data.references[k.key] = `${x[i + 4]}`
    })

    return data
  })

  return {data: result, baselines: keys}
}

export type ModuleIntegratorData = ReturnType<typeof digitalizeModuleIntegrator>

export function digitalize(workbook: Workbook) {
  return {
    authors: digitalizeAuthorTable(workbook),
    revisions: digitalizeRevision(workbook),
    sd: digitalizeSoftwareDevelopment(workbook),
    sw: digitalizeSoftware(workbook),
    mi: digitalizeModuleIntegrator(workbook)
  }
}

export type DigitalizeData = ReturnType<typeof digitalize>