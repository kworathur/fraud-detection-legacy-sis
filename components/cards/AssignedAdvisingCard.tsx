"use client";

import { useEffect, useState } from "react";
import AdvisingCard from "./AdvisingCard";
import { advisingCardData } from "@/lib/constants";
import { quaidApiRequest } from "@/lib/quaid-api-client";
import type { AdvisingAdvisorResponse } from "@/lib/quaid-api-types";

export default function AssignedAdvisingCard() {
  const [advisorName, setAdvisorName] = useState(advisingCardData.advisorName);

  useEffect(() => {
    const loadAdvisor = async () => {
      try {
        const response = await quaidApiRequest<AdvisingAdvisorResponse>(
          "advising/advisor",
        );

        const resolvedAdvisorName = response.advisorName?.trim();
        if (resolvedAdvisorName) {
          setAdvisorName(resolvedAdvisorName);
          return;
        }

        if (response.advisorId?.trim()) {
          setAdvisorName(response.advisorId);
        }
      } catch {
        // Keep the default mock data when advisor lookup is unavailable.
      }
    };

    void loadAdvisor();
  }, []);

  return (
    <AdvisingCard
      {...advisingCardData}
      advisorName={advisorName}
      chatMessage={{
        ...advisingCardData.chatMessage,
        sender: `Your Advisor, ${advisorName}`,
      }}
      actionItem={`Book a meeting with ${advisorName} to discuss threads`}
    />
  );
}
