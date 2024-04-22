import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { getWorkbook } from "@asterix/extractor"

import { digitalize, DigitalizeData } from "@/lib/digitalize"

export type Data = {
  data?: DigitalizeData
  setDataWithFile: (file: File) => Promise<void>
}

export const useDataStore = create<Data>()(
  persist(
    (set) => ({
      data: undefined,
      setDataWithFile: async (file) => {
        const buffer = await file.arrayBuffer()
        const workbook = await getWorkbook(buffer)
        set({data: digitalize(workbook)})
      },
    }),
    {
      name: 'data-storage'
    },
  ),
)