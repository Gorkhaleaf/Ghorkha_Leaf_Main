"use client"

import { useState, useMemo } from "react"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/ProductCard"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FilterState {
  collections: string[]
  origin: string[]
  flavor: string[]
  qualities: string[]
  caffeine: string[]
  allergens: string[]
  organic: boolean
}

interface FilterSectionProps {
  title: string
  options: string[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  isExpanded: boolean
  onToggle: () => void
}

function FilterSection({ title, options, selectedValues, onChange, isExpanded, onToggle }: FilterSectionProps) {
  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, option])
    } else {
      onChange(selectedValues.filter(v => v !== option))
    }
  }

  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 text-left"
      >
        <h3 className="font-medium text-base text-gray-900 uppercase tracking-wide">
          {title}
        </h3>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-600" />
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-3 mt-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${title}-${option}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                className="h-4 w-4"
              />
              <label
                htmlFor={`${title}-${option}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    collections: [],
    origin: [],
    flavor: [],
    qualities: [],
    caffeine: [],
    allergens: [],
    organic: false
  })

  const [expandedSections, setExpandedSections] = useState({
    collections: true,
    origin: false,
    flavor: false,
    qualities: false,
    caffeine: false,
    allergens: false
  })

  const [sortBy, setSortBy] = useState("default")

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const filterOptions = {
    collections: ["Black teas", "Green teas", "White teas", "Chai", "Matcha", "Herbal teas", "Oolong", "Rooibos", "Teaware"],
    origin: ["India", "Japan", "Iran", "South Africa"],
    flavor: ["Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Minty", "Bitter", "Creamy"],
    qualities: ["Detox", "Energy", "Relax", "Digestion"],
    caffeine: ["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"],
    allergens: ["Lactose-free", "Gluten-free", "Nuts-free", "Soy-free"]
  }

  // Filter and sort products based on current filters
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Collections filter
      if (filters.collections.length > 0) {
        const hasMatchingCollection = filters.collections.some(collection => 
          product.collections.includes(collection)
        )
        if (!hasMatchingCollection) return false
      }

      // Origin filter
      if (filters.origin.length > 0) {
        if (!filters.origin.includes(product.originCountry || "")) return false
      }

      // Flavor filter
      if (filters.flavor.length > 0) {
        const hasMatchingFlavor = filters.flavor.some(flavor => 
          product.flavors.includes(flavor)
        )
        if (!hasMatchingFlavor) return false
      }

      // Qualities filter
      if (filters.qualities.length > 0) {
        const hasMatchingQuality = filters.qualities.some(quality => 
          product.qualities.includes(quality)
        )
        if (!hasMatchingQuality) return false
      }

      // Caffeine filter
      if (filters.caffeine.length > 0) {
        if (!filters.caffeine.includes(product.caffeineLevel || "")) return false
      }

      // Allergens filter
      if (filters.allergens.length > 0) {
        const hasAllAllergens = filters.allergens.every(allergen => 
          product.allergens.includes(allergen)
        )
        if (!hasAllAllergens) return false
      }

      // Organic filter
      if (filters.organic && !product.isOrganic) return false

      return true
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Keep original order
        break
    }

    return filtered
  }, [filters, sortBy])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-32" />

      {/* Hero Section with Background Image */}
      <div
        className="relative h-80 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/collection_section.jpeg')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-6xl font-bold uppercase tracking-wider">
            Products
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-gray-600 uppercase tracking-wide">
          HOME/COLLECTIONS/CHAI
        </nav>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-6">
              {/* Collections Filter */}
              <FilterSection
                title="COLLECTIONS"
                options={filterOptions.collections}
                selectedValues={filters.collections}
                onChange={(values) => setFilters(prev => ({ ...prev, collections: values }))}
                isExpanded={expandedSections.collections}
                onToggle={() => toggleSection('collections')}
              />

              {/* Origin Filter */}
              <FilterSection
                title="ORIGIN"
                options={filterOptions.origin}
                selectedValues={filters.origin}
                onChange={(values) => setFilters(prev => ({ ...prev, origin: values }))}
                isExpanded={expandedSections.origin}
                onToggle={() => toggleSection('origin')}
              />

              {/* Flavor Filter */}
              <FilterSection
                title="FLAVOR"
                options={filterOptions.flavor}
                selectedValues={filters.flavor}
                onChange={(values) => setFilters(prev => ({ ...prev, flavor: values }))}
                isExpanded={expandedSections.flavor}
                onToggle={() => toggleSection('flavor')}
              />

              {/* Qualities Filter */}
              <FilterSection
                title="QUALITIES"
                options={filterOptions.qualities}
                selectedValues={filters.qualities}
                onChange={(values) => setFilters(prev => ({ ...prev, qualities: values }))}
                isExpanded={expandedSections.qualities}
                onToggle={() => toggleSection('qualities')}
              />

              {/* Caffeine Filter */}
              <FilterSection
                title="CAFFEINE"
                options={filterOptions.caffeine}
                selectedValues={filters.caffeine}
                onChange={(values) => setFilters(prev => ({ ...prev, caffeine: values }))}
                isExpanded={expandedSections.caffeine}
                onToggle={() => toggleSection('caffeine')}
              />

              {/* Allergens Filter */}
              <FilterSection
                title="ALLERGENS"
                options={filterOptions.allergens}
                selectedValues={filters.allergens}
                onChange={(values) => setFilters(prev => ({ ...prev, allergens: values }))}
                isExpanded={expandedSections.allergens}
                onToggle={() => toggleSection('allergens')}
              />

              {/* Organic Toggle */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between py-3">
                  <span className="font-medium text-base text-gray-900 uppercase tracking-wide">
                    ORGANIC
                  </span>
                  <Switch
                    checked={filters.organic}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, organic: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Products */}
          <div className="flex-1">
            {/* Sort Section */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-sm text-gray-600">
                Showing {filteredAndSortedProducts.length} of {products.length} products
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium text-base text-gray-900 uppercase tracking-wide">
                  SORT BY
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products match your current filters.</p>
                <Button
                  onClick={() => setFilters({
                    collections: [],
                    origin: [],
                    flavor: [],
                    qualities: [],
                    caffeine: [],
                    allergens: [],
                    organic: false
                  })}
                  className="mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Collections */}
            <div>
              <h3 className="font-medium text-base text-gray-900 uppercase tracking-wide mb-6">
                Collections
              </h3>
              <div className="space-y-2">
                {["Black teas", "Green teas", "White teas", "Herbal teas", "Matcha", "Chai", "Oolong", "Rooibos", "Teaware"].map((item) => (
                  <div key={item} className="text-sm text-gray-700">{item}</div>
                ))}
              </div>
            </div>

            {/* Learn */}
            <div>
              <h3 className="font-medium text-base text-gray-900 uppercase tracking-wide mb-6">
                Learn
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">About us</div>
                <div className="text-sm text-gray-700">About our teas</div>
                <div className="text-sm text-gray-700">Tea academy</div>
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-medium text-sm text-gray-900 uppercase tracking-wide mb-6">
                Customer Service
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">Ordering and payment</div>
                <div className="text-sm text-gray-700">Delivery</div>
                <div className="text-sm text-gray-700">Privacy and policy</div>
                <div className="text-sm text-gray-700">Terms & Conditions</div>
              </div>
            </div>

            {/* Contact us */}
            <div>
              <h3 className="font-medium text-base text-gray-900 uppercase tracking-wide mb-6">
                Contact us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="text-sm text-gray-700">
                    3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Province<br />
                    Iran
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  Email: amoopur@gmail.com
                </div>
                <div className="text-sm text-gray-700">
                  Tel: +98 9173038406
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
