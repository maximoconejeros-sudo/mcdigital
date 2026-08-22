"use client";

import { Component, type ReactNode } from "react";

export default class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("WebGL experience failed, falling back to static hero.", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
