import React, { useEffect, useState } from 'react';
import { useTranslation } from '../utils/i18n';

interface DailyReport {
  id?: string;
  date: string;
  completed: string;
  planned: string;
  blockers: string;
}

interface DailyReportFormProps {
  report?: DailyReport;
  onSubmit: (report: DailyReport) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const DailyReportForm: React.FC<DailyReportFormProps> = ({
  report,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<DailyReport>({
    date: '',
    completed: '',
    planned: '',
    blockers: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (report) {
      setFormData(report);
    } else {
      // 新規レポートの場合、今日の日付を設定
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: today
      }));
    }
  }, [report]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.date.trim()) {
      newErrors.date = t('dailyReport.dateRequired');
    }

    if (!formData.completed.trim()) {
      newErrors.completed = t('dailyReport.completedRequired');
    }

    if (!formData.planned.trim()) {
      newErrors.planned = t('dailyReport.plannedRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          {t('dailyReport.date')} <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.date ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.date && (
          <p className="text-sm text-red-600 mt-1">{errors.date}</p>
        )}
      </div>

      <div>
        <label htmlFor="completed" className="block text-sm font-medium text-gray-700 mb-1">
          {t('dailyReport.completed')} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="completed"
          name="completed"
          rows={4}
          value={formData.completed}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
            errors.completed ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={t('dailyReport.completedPlaceholder')}
        />
        {errors.completed && (
          <p className="text-sm text-red-600 mt-1">{errors.completed}</p>
        )}
      </div>

      <div>
        <label htmlFor="planned" className="block text-sm font-medium text-gray-700 mb-1">
          {t('dailyReport.planned')} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="planned"
          name="planned"
          rows={4}
          value={formData.planned}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
            errors.planned ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={t('dailyReport.plannedPlaceholder')}
        />
        {errors.planned && (
          <p className="text-sm text-red-600 mt-1">{errors.planned}</p>
        )}
      </div>

      <div>
        <label htmlFor="blockers" className="block text-sm font-medium text-gray-700 mb-1">
          {t('dailyReport.blockers')}
        </label>
        <textarea
          id="blockers"
          name="blockers"
          rows={3}
          value={formData.blockers}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          placeholder={t('dailyReport.blockersPlaceholder')}
        />
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? t('common.loading') : (report ? t('dailyReport.update') : t('dailyReport.save'))}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t('common.cancel')}
          </button>
        )}
      </div>
    </form>
  );
};

export default DailyReportForm;
