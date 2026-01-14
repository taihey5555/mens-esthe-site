import { getSupabase } from "@/lib/supabase/client"

type CourseRow = {
  id: string
  name: string
  duration_min: number
  price: number
  sort_order: number
}

export default async function PricingPage() {
  const supabase = getSupabase()
  const { data: courses } = await supabase
    .from("courses")
    .select("id,name,duration_min,price,sort_order")
    .order("sort_order", { ascending: true })

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-900">Pricing</h1>
          <p className="text-sm text-zinc-600">
            Course durations and pricing.
          </p>
        </header>

        <div className="space-y-3">
          {(courses as CourseRow[] | null)?.map((course) => (
            <div
              key={course.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-5 py-4 shadow-sm"
            >
              <div>
                <div className="text-base font-semibold text-zinc-900">
                  {course.name}
                </div>
                <div className="text-sm text-zinc-600">
                  {course.duration_min} min
                </div>
              </div>
              <div className="text-base font-semibold text-zinc-900">
                {course.price.toLocaleString()} JPY
              </div>
            </div>
          ))}
          {!courses?.length && (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">
              No courses available yet.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
