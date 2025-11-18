<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Generate and return the XML sitemap
     */
    public function index(): Response
    {
        // Cache the sitemap for 1 hour to reduce database queries
        $xml = Cache::remember('sitemap_xml', 3600, function () {
            return $this->generateSitemap();
        });

        return response($xml, 200)
            ->header('Content-Type', 'application/xml');
    }

    /**
     * Generate the sitemap XML content
     */
    private function generateSitemap(): string
    {
        $baseUrl = 'https://albiruni.sch.id';
        
        // Query all published news articles
        $newsArticles = News::where('is_published', true)
            ->orderBy('updated_at', 'desc')
            ->get();

        // Start building XML
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        // Add homepage with priority 1.0
        $xml .= '    <url>' . "\n";
        $xml .= '        <loc>' . $baseUrl . '/</loc>' . "\n";
        $xml .= '        <lastmod>' . now()->toIso8601String() . '</lastmod>' . "\n";
        $xml .= '        <changefreq>weekly</changefreq>' . "\n";
        $xml .= '        <priority>1.0</priority>' . "\n";
        $xml .= '    </url>' . "\n";

        // Add news index with priority 0.8
        $xml .= '    <url>' . "\n";
        $xml .= '        <loc>' . $baseUrl . '/berita/</loc>' . "\n";
        $xml .= '        <lastmod>' . now()->toIso8601String() . '</lastmod>' . "\n";
        $xml .= '        <changefreq>daily</changefreq>' . "\n";
        $xml .= '        <priority>0.8</priority>' . "\n";
        $xml .= '    </url>' . "\n";

        // Add all news articles with priority 0.6
        foreach ($newsArticles as $article) {
            $xml .= '    <url>' . "\n";
            $xml .= '        <loc>' . $baseUrl . '/berita/' . $article->slug . '</loc>' . "\n";
            $xml .= '        <lastmod>' . $article->updated_at->toIso8601String() . '</lastmod>' . "\n";
            $xml .= '        <changefreq>monthly</changefreq>' . "\n";
            $xml .= '        <priority>0.6</priority>' . "\n";
            $xml .= '    </url>' . "\n";
        }

        $xml .= '</urlset>';

        return $xml;
    }
}
