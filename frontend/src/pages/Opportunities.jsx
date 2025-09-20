import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import OpportunityCard from "../components/OpportunityCard";
import SearchFilter from "../components/SearchFilter";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorDisplay from "../components/ErrorDisplay";

const API_URL = import.meta.env.VITE_API_URL;

const Opportunities = () => {
  const { isAuthenticated } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
    sortBy: "deadline",
  });

  const categories = [
    "Bourse",
    "Stage",
    "Emploi",
    "Formation",
    "Concours",
    "Évènement",
    "Volontariat",
  ];

  const locations = [
    "Abidjan",
    "Bouaké",
    "Yamoussoukro",
    "San Pedro",
    "Korhogo",
    "Daloa",
    "Man",
    "Télétravail",
    "International",
  ];

  useEffect(() => {
    fetchOpportunities();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [filters, opportunities]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/opportunities/", {
        params: { page: currentPage },
      });
      setOpportunities(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des opportunités :", err);
      setError("Impossible de charger les opportunités. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...opportunities];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.organization.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    if (filters.location) {
      filtered = filtered.filter((item) => item.location === filters.location);
    }

    if (filters.sortBy === "deadline") {
      filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (filters.sortBy === "created") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredOpportunities(filtered);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      location: "",
      sortBy: "deadline",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (error) {
    return (
      <Layout>
        <ErrorDisplay message={error} retryAction={fetchOpportunities} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Toutes les opportunités</h1>
          {isAuthenticated && (
            <Link
              to="/opportunities/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Publier une opportunité
            </Link>
          )}
        </div>

        <SearchFilter
          filters={filters}
          categories={categories}
          locations={locations}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <EmptyState
            title="Aucune opportunité trouvée"
            description="Essayez d'ajuster vos filtres ou revenez plus tard."
            action={clearFilters}
            actionText="Réinitialiser les filtres"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Précédent
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  Suivant
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Opportunities;
