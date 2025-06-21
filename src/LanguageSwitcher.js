import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
  };

  return (
    <select className='form-control' value={i18n.language} onChange={handleLanguageChange}>
      <option className='btn-link' value="en_US">English</option>
      <option className='btn-link' value="de_DE">German</option>
    </select>
  );
};

export default LanguageSwitcher;