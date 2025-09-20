// src/services/aiService.js - Service API pour l'IA
class AIService {
  constructor() {
    this.baseURL = '/api/ai';
    this.getAuthHeaders = () => ({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    });
  }

  async getRecommendations() {
    try {
      const response = await fetch(`${this.baseURL}/recommendations/`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des recommandations');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur getRecommendations:', error);
      throw error;
    }
  }

  async getCareerAdvice(careerGoals) {
    try {
      const response = await fetch(`${this.baseURL}/career-advice/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ career_goals: careerGoals }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la génération des conseils');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur getCareerAdvice:', error);
      throw error;
    }
  }

  async getInterviewPrep(opportunityId) {
    try {
      const response = await fetch(`${this.baseURL}/interview-prep/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ opportunity_id: opportunityId }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la préparation d\'entretien');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur getInterviewPrep:', error);
      throw error;
    }
  }
}

export default new AIService();