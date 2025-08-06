import Image from 'next/image';
import { Header } from '@/components/Header';

export default function OurStory() {
  return (
    <div className="bg-background text-gray-800 font-sans">
      <Header />
      <header className="relative h-96">
        <Image
          src="/ourstory.jpg"
          alt="Tea gardens of Darjeeling"
          fill
          style={{objectFit: 'cover'}}
          className="opacity-50"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white tracking-wider">Our Story</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6 text-green-800">Gorkha Leaf – Brand Manifesto</h2>
          <div className="bg-background p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-green-700">🌿 My Story – The Heart Behind Gorkha Leaf</h3>
            <p className="mb-4">
              I was born to a family deeply rooted in the hills of Darjeeling. My mother worked tirelessly in the tea gardens, hand-plucking leaves under the sun with grace, strength, and dignity. Her labor, like that of many others in the estates, and yet, the world that sips Darjeeling tea often forgets the hands that plucked it.
            </p>
            <p className="mb-4">
              My father began his journey in the same tea estate, but life took a turn — he was fortunate to move into the Indian Army. I often think about how different our life could have been had he stayed behind. His path gave our family a level of stability, but it never distanced us from the struggles of our community back home.
            </p>
            <p className="mb-4">
              Growing up, I witnessed both — the hardship of those in the tea estates and the discipline and sacrifice that come with serving the nation. That contrast shaped me.
            </p>
            <p className="mb-4">
              When I decided to start my own business, I looked no further than the land I came from — rich, aromatic, and known worldwide. But this wasn’t just about selling tea. This was about telling the story of every leaf, every laborer, and every hill that gave it life.
            </p>
            <p className="mb-4">
              Gorkha Leaf is my tribute — to my parents, to every tea worker, and to the Gorkha spirit of resilience and pride.
            </p>
            <p className="mb-4">
              While I may not be able to change everything overnight, my dream is bigger than a brand. I want to give back: to support education for children in tea estates, bring smiles through festive gifts, and host community lunches that bring people together — starting in Darjeeling and spreading across every tea-growing region.
            </p>
            <p className="font-semibold text-lg">
              This isn’t just tea. This is a promise.
              <br />
              It’s my story.
              <br />
              It’s our story.
            </p>
          </div>
        </section>

        <section className="mb-12 grid md:grid-cols-2 gap-8">
          <div className="bg-background p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-green-700">Mission</h3>
            <p>
              To bring the authentic essence of Darjeeling’s tea culture to the world — one leaf, one story, and one soul at a time — while supporting the people and heritage that make it special.
            </p>
          </div>
          <div className="bg-background p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-green-700">Vision</h3>
            <p>
              To become a globally loved tea brand that celebrates the Gorkha spirit, uplifts local communities, and preserves the legacy of Himalayan tea craftsmanship.
            </p>
          </div>
        </section>

        <section className="mb-12 bg-background p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-center text-green-700">Core Values</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <li className="p-4 bg-green-50 rounded-md"><strong>Authenticity:</strong> We stay true to our roots — every leaf reflects Darjeeling's spirit.</li>
            <li className="p-4 bg-green-50 rounded-md"><strong>Respect:</strong> For our tea workers, land, customers, and traditions.</li>
            <li className="p-4 bg-green-50 rounded-md"><strong>Community First:</strong> We believe in growing together — our success is shared.</li>
            <li className="p-4 bg-green-50 rounded-md"><strong>Pride in Culture:</strong> We carry the Gorkha identity with strength and humility.</li>
            <li className="p-4 bg-green-50 rounded-md"><strong>Transparency:</strong> We tell real stories, source ethically, and share openly.</li>
            <li className="p-4 bg-green-50 rounded-md"><strong>Mindful Craftsmanship:</strong> Each pouch is packed with care, passion, and purpose.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-center mb-6 text-green-800">📜 Why I Chose the Name “Gorkha Leaf”</h2>
          <div className="bg-background p-8 rounded-lg shadow-md">
            <p className="mb-4">
              The name Gorkha Leaf is not just a brand — it’s a tribute to who we are, where we come from, and what we stand for.
            </p>
            <p className="mb-4">
              “Gorkha” represents the proud and resilient people of the hills — known not only for their contribution to tea cultivation but also for their legendary strength, discipline, and bravery.
            </p>
            <p className="mb-4">
              Historically, the Gorkhas are known as fearless warriors, respected across the world for their service in the Indian Army and British Army. My own father served in the army, which makes this connection even more personal.
            </p>
            <p className="mb-4">
              “Leaf” represents our product — the sacred Darjeeling tea leaf — but it also symbolizes every story and sacrifice woven into that cup of tea.
            </p>
            <p className="font-semibold text-lg mb-4">
              Together, Gorkha Leaf stands for:
            </p>
            <ul className="list-none space-y-2">
              <li>🌿 Heritage</li>
              <li>🛡️ Honor</li>
              <li>💚 Hard Work</li>
              <li>⚔️ Courage</li>
            </ul>
            <p className="mt-4 font-semibold text-lg">
              It’s a name that holds the past with pride and moves toward the future with purpose.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
