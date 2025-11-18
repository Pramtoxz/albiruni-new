<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display a listing of published news.
     */
    public function index()
    {
        $news = News::where('is_published', true)
            ->orderBy('published_at', 'desc')
            ->paginate(9);

        return Inertia::render('berita/index', [
            'news' => $news,
            'seo' => [
                'title' => 'Berita & Kegiatan - Al-Biruni Daycare Padang',
                'description' => 'Berita terbaru dan kegiatan dari Al-Biruni Preschool & Daycare Padang. Informasi seputar pendidikan anak usia dini di Sumatera Barat.',
                'canonical' => 'https://albiruni.sch.id/berita/',
                'keywords' => 'berita daycare padang, kegiatan preschool padang, informasi tk padang, berita pendidikan anak padang',
                'ogImage' => 'https://albiruni.sch.id/apple-touch-icon.png'
            ]
        ]);
    }

    /**
     * Display the specified news article.
     */
    public function show(string $slug)
    {
        $news = News::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        // Get related news (3 latest excluding current)
        $relatedNews = News::where('is_published', true)
            ->where('id', '!=', $news->id)
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();

        // Prepare meta description from excerpt (limit to 160 characters)
        $metaDescription = $news->excerpt 
            ? (strlen($news->excerpt) > 160 ? substr($news->excerpt, 0, 157) . '...' : $news->excerpt)
            : 'Berita dari Al-Biruni Preschool & Daycare Padang';

        // Prepare OG image
        $ogImage = $news->image_url 
            ? (filter_var($news->image_url, FILTER_VALIDATE_URL) ? $news->image_url : asset($news->image_url))
            : 'https://albiruni.sch.id/apple-touch-icon.png';

        return Inertia::render('berita/show', [
            'news' => $news,
            'relatedNews' => $relatedNews,
            'seo' => [
                'title' => $news->title . ' - Al-Biruni Daycare Padang',
                'description' => $metaDescription,
                'canonical' => 'https://albiruni.sch.id/berita/' . $news->slug,
                'keywords' => 'daycare padang, preschool padang, berita pendidikan anak, ' . strtolower($news->title),
                'ogImage' => $ogImage,
                'articlePublishedTime' => $news->published_at ? $news->published_at->toIso8601String() : null,
                'articleModifiedTime' => $news->updated_at ? $news->updated_at->toIso8601String() : null
            ],
            'structuredData' => [
                'article' => [
                    'headline' => $news->title,
                    'datePublished' => $news->published_at ? $news->published_at->toIso8601String() : null,
                    'dateModified' => $news->updated_at ? $news->updated_at->toIso8601String() : null,
                    'author' => 'Al-Biruni Preschool & Daycare',
                    'image' => $ogImage,
                    'description' => $metaDescription,
                    'url' => 'https://albiruni.sch.id/berita/' . $news->slug
                ]
            ]
        ]);
    }
}
