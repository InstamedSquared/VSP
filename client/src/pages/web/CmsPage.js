import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useOutletContext } from 'react-router-dom';
import api from '../../api/api';
import PageLoader from '../../components/common/PageLoader';
import CmsSectionRenderer from '../../components/cms/CmsSectionRenderer';

const CmsPage = () => {
    const { slug: urlSlug } = useParams();
    const location = useLocation();
    const { settings, setPageConfig } = useOutletContext();

    const slug = useMemo(() => {
        const pathToSlug = { '/': 'home', '/about': 'about', '/contact': 'contact' };
        return urlSlug || pathToSlug[location.pathname] || 'home';
    }, [urlSlug, location.pathname]);

    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/api/cms/page/${slug}`);
                if (response.data.success) {
                    const { page, sections } = response.data.data;
                    setPageData({ page, sections });
                    if (setPageConfig) {
                        setPageConfig({
                            hasHeader: page.has_header === 1,
                            hasFooter: page.has_footer === 1,
                        });
                    }

                    // SEO Updates
                    document.title = page.meta_title || page.title;
                    const metaDesc = document.querySelector('meta[name="description"]');
                    if (metaDesc) metaDesc.setAttribute('content', page.meta_description || '');

                    const metaKeywords = document.querySelector('meta[name="keywords"]');
                    if (metaKeywords) metaKeywords.setAttribute('content', page.meta_keywords || '');
                } else {
                    setError('Page not found');
                }
            } catch (err) {
                setError('Page not found');
            } finally {
                setLoading(false);
                //setTimeout(() => setLoading(false), 2000);  // jeric // page loading timer
            }
        };
        fetchPage();
    }, [slug, setPageConfig]);

    if (loading) {  // jeric loading style here
        return (
            <div className='webpage-panel'>
                <PageLoader type='list' count={3} />
            </div>
        );
    }

    if (error || !pageData) {
        return (
            <div className='webpage-panel cms-page-not-found'>
                <div className='seczone'><div className='seczone-in' style={{ textAlign: 'center', padding: '80px 0' }}>
                    <h1>404</h1>
                    <p>Page not found</p>
                </div></div>
            </div>
        );
    }

    return (
        <div className='webpage-panel'>
            {pageData.sections.map(section => (
                <CmsSectionRenderer key={section.id} section={section} />
            ))}
        </div>
    );

};

export default CmsPage;