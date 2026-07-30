"use client";

import Link from "next/link";
import Image from "next/image";
import { Tour } from "@/data/tours";

interface Props {
  tour: Tour;
}

export default function TourCard({ tour }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="relative h-40 w-full">
        <Image
          src={tour.image}
          alt={tour.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-2 p-4">
        <h3 className="font-semibold text-gray-900">
          {tour.name}
        </h3>

        <p className="text-sm text-gray-600">
          {tour.shortDescription}
        </p>

        <div className="text-sm text-gray-700">
          <div>💵 ${tour.price}</div>
          <div>🕒 {tour.duration}</div>
          <div>⭐ {tour.difficulty}</div>
        </div>

        <Link
          href={`/tours/${tour.slug}`}
          className="inline-block rounded-lg bg-jungle-700 px-4 py-2 text-sm font-medium text-white hover:bg-jungle-800"
        >
          View Tour
        </Link>
      </div>
    </div>
  );
}