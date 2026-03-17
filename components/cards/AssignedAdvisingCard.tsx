'use client';

import { useEffect, useState } from 'react';
import AdvisingCard from './AdvisingCard';
import { advisingCardData } from '@/lib/constants';
import { quaidApiRequest } from '@/lib/quaid-api-client';
import type {
    AdvisingAdvisorResponse,
    AdvisingInsightsResponse,
    AdvisingSlotsResponse,
    InsightExecuteResponse,
} from '@/lib/quaid-api-types';

export default function AssignedAdvisingCard() {
    const [advisorName, setAdvisorName] = useState(
        advisingCardData.advisorName
    );
    const [insightMessage, setInsightMessage] = useState(
        advisingCardData.chatMessage.text
    );
    const [slotsLeft, setSlotsLeft] = useState(advisingCardData.slotsLeft);

    useEffect(() => {
        const loadInsight = async () => {
            try {
                // 1. Get the student's assigned advisor
                const advisor =
                    await quaidApiRequest<AdvisingAdvisorResponse>(
                        'advising/advisor'
                    );
                const resolvedName =
                    advisor.advisorName?.trim().split(' ').at(0) || '';
                setAdvisorName(resolvedName);

                // 2. Get available slots to show how many are left this week
                try {
                    const slots = await quaidApiRequest<AdvisingSlotsResponse>(
                        `advising/availability/advisor/${advisor.advisorId}`
                    );
                    const available = slots.data.filter(
                        (s) => s.status === 'AVAILABLE'
                    ).length;
                    setSlotsLeft(available);
                } catch {
                    // Keep default slots count if availability lookup fails
                }

                // 3. Get the advisor's configured insights
                const insights =
                    await quaidApiRequest<AdvisingInsightsResponse>(
                        'advising/insights'
                    );
                if (insights.data.length === 0) return;

                // 4. Execute the first insight for this student
                const insight = insights.data[0];
                const meResponse = await fetch('/api/me/role', {
                    cache: 'no-store',
                });
                const me = (await meResponse.json()) as { sub: string | null };
                if (!me.sub) return;

                const result = await quaidApiRequest<InsightExecuteResponse>(
                    `advising/insights/${insight.insightId}/execute?studentId=${me.sub}`
                );

                if (result.message) {
                    setInsightMessage(result.message);
                }
            } catch {
                // Keep default mock data when API calls are unavailable
            }
        };

        void loadInsight();
    }, []);

    return (
        <AdvisingCard
            {...advisingCardData}
            advisorName={advisorName}
            slotsLeft={slotsLeft}
            chatMessage={{
                ...advisingCardData.chatMessage,
                sender: `Your Advisor${advisorName ? ', ' + advisorName + '\u2728' : ''}`,
                text: insightMessage,
            }}
            actionItem={`Book a meeting with ${advisorName ? advisorName : 'your advisor'} to discuss threads`}
        />
    );
}
