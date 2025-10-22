"use client"
import React from 'react'
import Image from 'next/image'
import './OurStoryCompact.css'

type Props = {
  imageSrc?: string
  ownerName?: string
}

export default function OurStoryCompact({
  imageSrc = '/Extra_content/owner1.jpg',
  ownerName = 'Founder'
}: Props) {
  return (
    <section id="our-story-compact" className="os-compact" aria-labelledby="os-compact-title">
      <div className="os-shell">
        <div className="os-copy">
          <div className="os-kicker">A tribute from the hills</div>
          <h2 id="os-compact-title" className="os-title">Our Story</h2>

          <p className="os-lede">
            Gorkha Leaf began in the misty slopes of Darjeeling—born from lived experience and a promise to honor the hands behind every cup.
          </p>

          <div className="os-content" data-role="content">
            <p>
              I was born to a family deeply rooted in the hills of Darjeeling. My mother worked tirelessly in the tea gardens, hand‑plucking leaves under the sun with grace, strength, and dignity. Her labor, like that of many others in the estates, often goes unseen.
            </p>
            <p>
              Growing up, I witnessed both hardship and pride — and that shaped the way I wanted to build this brand: with respect, transparency, and a desire to give back.
            </p>
          </div>

          <div className="os-cta">
            <a className="os-readmore" href="/our-story">Read our entire story</a>
          </div>
        </div>

        <aside className="os-card--compact" aria-label="Founder">
          <div className="os-avatar-wrap" aria-hidden="true">
            <Image className="os-avatar os-avatar-inline" src={imageSrc} alt={`${ownerName} portrait`} width={286} height={286} />
          </div>

          <div className="os-owner-overlay" role="group" aria-label="Founder details">
            <div className="os-founder-name" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Nikesh Rai</div>
            <div className="os-name">{ownerName}</div>
            <div className="os-role">Founder, Gorkha Leaf</div>
            <div className="os-sign">"Made at origin. Honoring every leaf."</div>
            <div className="os-decor-line" />
          </div>
        </aside>
      </div>
    </section>
  )
}