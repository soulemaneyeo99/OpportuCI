import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import OpportunityForm from '../components/OpportunityForm';
import { CategoryAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const OpportunityEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        const data = await getOpportunity(id);
        
        // Check if the user has permission to edit this opportunity
        if (data.created_by !== user.id) {
          setError("You don't have permission to edit this opportunity");
          return;
        }
        
        setOpportunity(data);
      } catch (err) {
        setError('Failed to load opportunity: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, user]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setFormError(null);
      
      await updateOpportunity(id, formData);
      
      // Redirect to opportunity detail page after successful update
      navigate(`/opportunities/${id}`);
    } catch (err) {
      setFormError('Failed to update opportunity: ' + (err.message || 'Unknown error'));
      window.scrollTo(0, 0); // Scroll to top to show the error
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex justify-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <ErrorAlert message={error} />
          <div className="mt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Opportunity</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update the information for this opportunity.
          </p>
        </div>

        {formError && <ErrorAlert message={formError} className="mb-6" />}

        <OpportunityForm 
          initialValues={opportunity}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          isEditMode={true}
        />
      </div>
    </Layout>
  );
};

export default OpportunityEdit;