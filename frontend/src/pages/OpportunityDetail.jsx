import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, isAfter } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ArrowLeftIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorDisplay from "../components/ErrorDisplay";
import ConfirmDialog from "../components/ConfirmDialog";



const API_URL = import.meta.env.VITE_API_URL;

const OpportunityDetail = () => {
  const [chatOpen, setChatOpen] = useState(false);

  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/opportunities/${id}/`);
      setOpportunity(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch opportunity:", err);
      setError(
        err.response?.status === 404
          ? "This opportunity doesn't exist or has been removed."
          : "Failed to load opportunity details. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/opportunities/${id}/`);
      navigate("/opportunities", { 
        state: { message: "Opportunity successfully deleted" } 
      });
    } catch (err) {
      console.error("Failed to delete opportunity:", err);
      setError("Failed to delete opportunity. Please try again.");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      })
      .catch(err => console.error('Failed to copy URL: ', err));
  };

  const isOwner = opportunity && user && opportunity.created_by === user.id;
  const isDeadlinePassed = opportunity && !isAfter(new Date(opportunity.deadline), new Date());

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton type="detail" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay message={error} retryAction={fetchOpportunity} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/opportunities"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Opportunities
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isDeadlinePassed ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                }`}>
                  {isDeadlinePassed ? "Expired" : "Active"}
                </span>
                {opportunity.is_verified && (
                  <span className="ml-3 inline-flex items-center text-sm text-green-700">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {isOwner && (
                  <>
                    <Link 
                      to={`/opportunities/edit/${id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <button 
                      onClick={() => setShowConfirmDelete(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </>
                )}
                <button 
                  onClick={handleShare}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {copySuccess ? (
                    <>
                      <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ShareIcon className="h-4 w-4 mr-1" />
                      Share
                    </>
                  )}
                </button>
              </div>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">{opportunity.title}</h1>
            <p className="mt-1 text-gray-600">{opportunity.organization}</p>
          </div>

          {/* Key details */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                  <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-sm font-semibold text-gray-900">{opportunity.category}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                  <MapPinIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{opportunity.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Deadline</p>
                  <p className={`text-sm font-semibold ${isDeadlinePassed ? "text-red-600" : "text-gray-900"}`}>
                    {format(new Date(opportunity.deadline), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
            <div className="prose max-w-none text-gray-700">
              {opportunity.description.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1.5" />
              <span>Posted by {opportunity.created_by_name || "Unknown"}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1.5" />
              <span>Posted on {format(new Date(opportunity.created_at), "MMMM d, yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Apply CTA */}
        {!isDeadlinePassed && (
          <div className="mt-6 text-center">
            <a
              href={opportunity.application_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Now
            </a>
            <p className="mt-2 text-sm text-gray-500">
              Don't miss this opportunity! Apply before the deadline.
            </p>
          </div>
        )}

        {/* Similar opportunities would go here */}

        {/* Delete confirmation dialog */}
        {showConfirmDelete && (
          <ConfirmDialog
            title="Delete Opportunity"
            message="Are you sure you want to delete this opportunity? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={handleDelete}
            onCancel={() => setShowConfirmDelete(false)}
            isDangerous={true}
          />
          
        )}
      
      </div>
    </Layout>
  );
};

export default OpportunityDetail;