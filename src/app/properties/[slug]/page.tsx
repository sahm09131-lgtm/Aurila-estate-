import Link from "next/link";
import { notFound } from "next/navigation";
import { properties } from "@/lib/properties";

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = properties.find((item) => item.slug === slug);
  if (!property) notFound();
  return <main className="detail-page">
    <header className="detail-nav"><Link className="brand" href="/">AURELIA <span>ESTATES</span></Link><Link href="/#properties">← All properties</Link></header>
    <div className="detail-photo" style={{ backgroundImage: `linear-gradient(0deg,rgba(8,19,17,.22),transparent),url('${property.image}')` }} role="img" aria-label={`${property.title} exterior`} />
    <article className="detail-content">
      <p className="eyebrow">ILLUSTRATIVE DEMO LISTING · {property.location.toUpperCase()}</p>
      <div className="detail-heading"><div><h1>{property.title}</h1><p>{property.location}</p></div><strong>{property.priceLabel}</strong></div>
      <div className="spec-row"><span>{property.beds} bedrooms</span><span>{property.baths} bathrooms</span><span>{property.area} m²</span><span>{property.type}</span></div>
      <p className="detail-copy">This sample listing is demonstration content only. Replace it with verified property details before publication. Contact the team to register your interest in this example property.</p>
      <a className="button button-dark" href="mailto:enquiries@example.com?subject=Demo%20property%20enquiry">Enquire about this property</a>
    </article>
    <footer className="footer"><span>AURELIA ESTATES</span><span>Illustrative demo content · Not an active listing</span></footer>
  </main>;
}
