import RoadPageClient from "./page-client";

interface RoadPageProps {
  params: Promise<{
    roadId: string;
  }>;
}

export default async function RoadPage({ params }: RoadPageProps) {
  const { roadId } = await params;
  return <RoadPageClient roadId={roadId} />;
}
