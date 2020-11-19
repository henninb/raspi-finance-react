import React from "react"
import Loader from "react-loader-spinner"

export default function Spinner() {
  return (
    <div data-testid="loader">
      <Loader type="Rings" color="#9965f4" />
    </div>
  )
}
