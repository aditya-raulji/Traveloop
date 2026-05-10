import { PageTitle } from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="container mx-auto px-6 lg:px-12 py-12 flex flex-col items-center text-center">
      <PageTitle size="hero" className="mb-6">
        Discover the World
      </PageTitle>
      <p className="text-earth-muted max-w-2xl text-lg mb-12">
        Traveloop is your personalized, cinematic travel planning companion. Let's create your next journey.
      </p>
      <Button variant="primary">Start Planning</Button>
    </div>
  );
}
