import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useDataStore } from "@/stores/data"

function Index() {
  const setDataWithFile = useDataStore((state) => state.setDataWithFile)
  const navigate = useNavigate()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await setDataWithFile(e.target.files[0]);
      await navigate({
        to: "/app"
      })
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture" className='pl-2'>CID excel file</Label>
        <Input id="picture" type="file" onChange={handleFileChange} />
      </div>
    </div>
  )
}