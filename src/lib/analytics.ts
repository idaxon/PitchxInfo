import { recordAnalytics } from './supabase';
import { RespondentType } from '../types';

export const analytics = {
  pageView: (source = 'direct') => {
    recordAnalytics({
      event_name: 'landing_page_visit',
      metadata: {
        source,
        referrer: document.referrer || 'direct',
        path: window.location.pathname,
      }
    });
  },

  selectRespondent: (type: RespondentType) => {
    recordAnalytics({
      event_name: 'respondent_selected',
      respondent_type: type,
    });
  },

  startSurvey: (type: RespondentType) => {
    recordAnalytics({
      event_name: 'survey_start',
      respondent_type: type,
      metadata: { started_at: new Date().toISOString() }
    });
  },

  viewQuestion: (type: RespondentType, questionIndex: number, questionKey: string) => {
    recordAnalytics({
      event_name: 'survey_question_view',
      respondent_type: type,
      metadata: { question_index: questionIndex, question_key: questionKey }
    });
  },

  answerQuestion: (type: RespondentType, questionIndex: number, questionKey: string, answer: any) => {
    recordAnalytics({
      event_name: 'survey_question_answered',
      respondent_type: type,
      metadata: { question_index: questionIndex, question_key: questionKey, answer_summary: typeof answer === 'object' ? JSON.stringify(answer) : String(answer) }
    });
  },

  abandonSurvey: (type: RespondentType, lastQuestionIndex: number) => {
    recordAnalytics({
      event_name: 'survey_abandon',
      respondent_type: type,
      metadata: { drop_off_index: lastQuestionIndex }
    });
  },

  completeSurvey: (type: RespondentType, fileNumber: string) => {
    recordAnalytics({
      event_name: 'survey_complete',
      respondent_type: type,
      metadata: { file_number: fileNumber }
    });
  },

  joinWaitlist: (email: string, type: 'job_seeker' | 'recruiter' | 'general') => {
    recordAnalytics({
      event_name: 'waitlist_registration',
      respondent_type: type,
      metadata: { email_domain: email.split('@')[1] || 'unknown' }
    });
  }
};
