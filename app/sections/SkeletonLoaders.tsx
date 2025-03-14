export function FeaturedBooksSkeleton() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/50 relative overflow-hidden'>
      <div className='container mx-auto px-4 md:px-6 relative'>
        <div className='flex flex-col items-center justify-center space-y-6 text-center mb-8'>
          <div className='space-y-3 w-full max-w-[900px] animate-pulse'>
            <div className='h-6 bg-muted-foreground/20 w-32 mx-auto rounded-lg'></div>
            <div className='h-10 bg-muted-foreground/20 w-3/4 mx-auto rounded-lg'></div>
            <div className='h-6 bg-muted-foreground/20 w-2/3 mx-auto rounded-lg'></div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 py-8'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='h-[350px] bg-muted-foreground/10 rounded-lg animate-pulse'
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TrendingSkeleton() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
      <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2 w-full max-w-[900px] animate-pulse'>
            <div className='h-6 bg-muted-foreground/20 w-32 mx-auto rounded-lg'></div>
            <div className='h-10 bg-muted-foreground/20 w-3/4 mx-auto rounded-lg'></div>
            <div className='h-6 bg-muted-foreground/20 w-2/3 mx-auto rounded-lg'></div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 py-12'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='h-[300px] bg-muted-foreground/10 rounded-lg animate-pulse'
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSkeleton() {
  return (
    <section className='w-full py-12 md:py-24 bg-background'>
      <div className='container mx-auto px-4 md:px-6 max-w-6xl'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2 w-full max-w-[900px] animate-pulse'>
            <div className='h-6 bg-muted-foreground/20 w-32 mx-auto rounded-lg'></div>
            <div className='h-10 bg-muted-foreground/20 w-3/4 mx-auto rounded-lg'></div>
            <div className='h-6 bg-muted-foreground/20 w-2/3 mx-auto rounded-lg'></div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 py-12'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='h-[200px] bg-muted-foreground/10 rounded-lg animate-pulse'
            ></div>
          ))}
        </div>
      </div>
    </section>
  )
}
