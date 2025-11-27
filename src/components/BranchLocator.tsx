import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Phone, Car, Filter, Search, Navigation } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  type: 'branch' | 'atm';
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  phone?: string;
  hours?: any;
  services?: any;
  is_24_hours: boolean;
  has_drive_thru: boolean;
  has_parking: boolean;
  is_accessible: boolean;
}

interface BranchLocatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const BranchLocator: React.FC<BranchLocatorProps> = ({ isOpen, onClose }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Load branches from API
  useEffect(() => {
    if (isOpen) {
      fetchBranches();
      getUserLocation();
    }
  }, [isOpen]);

  // Update filtered branches when search or filter changes
  useEffect(() => {
    if (branches.length > 0) {
      handleSearch();
    }
  }, [searchQuery, selectedType, branches.length]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/branches');
      const data = await response.json();
      
      if (data.success && data.branches) {
        // Ensure latitude and longitude are numbers
        const processedBranches = data.branches.map((branch: any) => ({
          ...branch,
          latitude: parseFloat(branch.latitude) || 0,
          longitude: parseFloat(branch.longitude) || 0,
        }));
        setBranches(processedBranches);
        setFilteredBranches(processedBranches);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranches([]);
      setFilteredBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleSearch = () => {
    let filtered = branches;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(branch =>
        branch.name.toLowerCase().includes(query) ||
        branch.address.toLowerCase().includes(query) ||
        branch.city.toLowerCase().includes(query) ||
        branch.state.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(branch => branch.type === selectedType);
    }

    setFilteredBranches(filtered);
  };

  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  const openGoogleMaps = (branch?: Branch) => {
    if (branch) {
      // Open specific branch location in Google Maps
      const url = `https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (userLocation) {
      // Open Google Maps with user location and search for Commerce Bank
      const url = `https://www.google.com/maps/search/Commerce+Bank/@${userLocation.lat},${userLocation.lng},14z`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Default to Kansas City area
      const url = `https://www.google.com/maps/search/Commerce+Bank/@39.0997,-94.5786,14z`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getDirections = (branch: Branch) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Find Branches & ATMs</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full" style={{ height: 'calc(90vh - 80px)' }}>
          {/* Left Panel - Search and List */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200 space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search by name, address, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="branch">Branches Only</SelectItem>
                    <SelectItem value="atm">ATMs Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Open Google Maps Button */}
              <Button
                onClick={() => openGoogleMaps()}
                className="w-full bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] hover:opacity-90 text-white font-semibold"
              >
                <MapPin className="h-4 w-4 mr-2" />
                View All Locations on Google Maps
              </Button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading branches...
                </div>
              ) : filteredBranches.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No branches found matching your criteria.
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  {filteredBranches.map((branch) => (
                    <Card 
                      key={branch.id} 
                      className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedBranch?.id === branch.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleBranchClick(branch)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{branch.name}</h3>
                              <Badge variant={branch.type === 'branch' ? 'default' : 'secondary'}>
                                {branch.type.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{branch.address}</p>
                            <p className="text-sm text-gray-500">{branch.city}, {branch.state} {branch.zip_code}</p>
                            
                            {/* Features */}
                            <div className="flex items-center space-x-3 mt-2">
                              {branch.is_24_hours && (
                                <div className="flex items-center space-x-1 text-green-600">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-xs">24/7</span>
                                </div>
                              )}
                              {branch.has_drive_thru && (
                                <div className="flex items-center space-x-1 text-blue-600">
                                  <Car className="h-3 w-3" />
                                  <span className="text-xs">Drive-thru</span>
                                </div>
                              )}
                              {branch.is_accessible && (
                                <div className="flex items-center space-x-1 text-purple-600">
                                  <div className="h-3 w-3 bg-purple-600 rounded-full"></div>
                                  <span className="text-xs">Accessible</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                openGoogleMaps(branch);
                              }}
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                getDirections(branch);
                              }}
                            >
                              <Navigation className="h-3 w-3 mr-1" />
                              Directions
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Google Maps Preview */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="text-center max-w-md">
              <MapPin className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                View Locations on Google Maps
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Click "View All Locations on Google Maps" above or click "View" on any branch/ATM to open Google Maps in a new tab.
              </p>
              {selectedBranch && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">{selectedBranch.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{selectedBranch.address}</p>
                  <Button
                    onClick={() => openGoogleMaps(selectedBranch)}
                    className="w-full bg-gradient-to-r from-[hsl(var(--commerce-green))] to-[hsl(var(--commerce-teal))] hover:opacity-90 text-white"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BranchLocator;
