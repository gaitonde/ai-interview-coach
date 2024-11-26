import * as React from "react"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full bg-gray-700 rounded-full ${className}`}
        {...props}
      >
        <div
          className="bg-blue-500 rounded-full h-full transition-all duration-300 ease-in-out"
          style={{ width: `${value}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }

