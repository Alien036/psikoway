"use client";

import React, { use } from "react";
import ProfilePage from "../page";

export default function ProfileDynamicPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <ProfilePage forcedId={resolvedParams.id} />;
}
