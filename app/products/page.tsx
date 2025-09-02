"use client"

import { useState, useMemo, useEffect } from "react"
import { ProductCard } from "@/components/ProductCard"
import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface Product {
  id: number
  name: string
  slug?: string
  description?: string
  price?: number
  image?: string
  mainImage?: string
  collections?: string[]
  flavors?: string[]
  qualities?: string[]
  isOrganic?: boolean
}

interface FilterState {
  collections: string[]
  flavor: string[]
  qualities: string[]
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
   const isMobile = useIsMobile()
   const [filters, setFilters] = useState<FilterState>({
     collections: [],
     flavor: [],
     qualities: [],
     organic: false
   })
   const [products, setProducts] = useState<Product[]>([])
   const [expandedSections, setExpandedSections] = useState({
     collections: true,
     flavor: false,
     qualities: false
   })

   const [sortBy, setSortBy] = useState("default")
   const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    fetch("/api/admin/products")
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data) => { if (mounted) setProducts(data || []) })
      .catch((err) => {
        console.error("Failed to load products", err)
        setProducts([])
      })
    return () => { mounted = false }
  }, [])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const filterOptions = {
    collections: ["Black teas", "Green teas", "Herbal teas"],
    flavor: ["Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Minty", "Creamy"],
    qualities: ["Detox", "Energy", "Relax", "Digestion"]
  }

  // Filter and sort products based on current filters
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Collections filter
      if (filters.collections.length > 0) {
        const hasMatchingCollection = filters.collections.some(collection => 
          (product.collections || []).includes(collection)
        )
        if (!hasMatchingCollection) return false
      }

      // Flavor filter
      if (filters.flavor.length > 0) {
        const hasMatchingFlavor = filters.flavor.some(flavor => 
          (product.flavors || []).includes(flavor)
        )
        if (!hasMatchingFlavor) return false
      }

      // Qualities filter
      if (filters.qualities.length > 0) {
        const hasMatchingQuality = filters.qualities.some(quality => 
          (product.qualities || []).includes(quality)
        )
        if (!hasMatchingQuality) return false
      }

      // Organic filter
      if (filters.organic && !product.isOrganic) return false

      return true
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "name":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        break
      default:
        // Keep original order
        break
    }

    return filtered
  }, [filters, sortBy, products])

  // Mobile Filter Drawer Component
  const MobileFilterDrawer = () => (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetContent side="left" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle className="text-left uppercase tracking-wide">Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 overflow-y-auto">
          {/* Collections Filter */}
          <FilterSection
            title="COLLECTIONS"
            options={filterOptions.collections}
            selectedValues={filters.collections}
            onChange={(values) => setFilters(prev => ({ ...prev, collections: values }))}
            isExpanded={expandedSections.collections}
            onToggle={() => toggleSection('collections')}
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

          <div className="pt-4">
            <Button
              onClick={() => setIsFilterOpen(false)}
              className="w-full"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-32" />

      {/* Hero Section with Background Image */}
      <div
        className="relative h-48 sm:h-64 md:h-80 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/collection_section.jpeg')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider px-4 text-center">
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
        <div className="flex gap-4 md:gap-8">
          {/* Desktop Sidebar - Filters */}
          {!isMobile && (
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
          )}

          {/* Right Content - Products */}
          <div className="flex-1">
            {/* Mobile Filter Button and Sort Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle className="text-left uppercase tracking-wide">Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-6 overflow-y-auto">
                        {/* Collections Filter */}
                        <FilterSection
                          title="COLLECTIONS"
                          options={filterOptions.collections}
                          selectedValues={filters.collections}
                          onChange={(values) => setFilters(prev => ({ ...prev, collections: values }))}
                          isExpanded={expandedSections.collections}
                          onToggle={() => toggleSection('collections')}
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
                    </SheetContent>
                  </Sheet>
                )}
                <div className="text-sm text-gray-600">
                  Showing {filteredAndSortedProducts.length} of {products.length} products
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <span className="font-medium text-sm sm:text-base text-gray-900 uppercase tracking-wide whitespace-nowrap">
                  SORT BY
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green flex-1 sm:flex-none"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} compact={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products match your current filters.</p>
                <Button
                  onClick={() => setFilters({
                    collections: [],
                    flavor: [],
                    qualities: [],
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
      <Footer />
    </div>
  )
}
