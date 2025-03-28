"use client";

import { ToolForm } from "@/components/ToolForm";
import { tools } from "@/data/tools";
import { useMixpanel } from "@/hooks/use-mixpanel";
import { Tool } from "@/types/tools";
import React, { useEffect, useState } from "react";

export default function ToolDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { track } = useMixpanel();
  const [tool, setTool] = useState<Tool>();
  const { slug } = React.use(params);

  const getToolBySlug = (slug: string) => {
    return tools.find(tool => tool.slug === slug);
  }

  //setup tool and inputs
  useEffect(() => {
    const tool = getToolBySlug(slug);
    setTool(tool);
    track('v2.ViewedTool', { slug });
  }, []);

  return tool ?
    <ToolForm slug={tool.slug} /> :
    null;
}
