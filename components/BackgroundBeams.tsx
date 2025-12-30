"use client";
import React, { useEffect, useState } from 'react';

export const BackgroundBeams = () => {
    const [beams, setBeams] = useState<{ id: number; left: string; delay: string; duration: string }[]>([]);

    useEffect(() => {
        const newBeams = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 10}s`,
            duration: `${5 + Math.random() * 5}s`,
        }));
        setBeams(newBeams);
    }, []);

    return (
        <div className="bg-beams">
            {beams.map((beam) => (
                <div
                    key={beam.id}
                    className="beam"
                    style={{
                        left: beam.left,
                        animationDelay: beam.delay,
                        animationDuration: beam.duration,
                    }}
                />
            ))}
        </div>
    );
};
