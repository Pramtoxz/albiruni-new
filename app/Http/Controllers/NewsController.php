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
            'news' => $news
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

        return Inertia::render('berita/show', [
            'news' => $news,
            'relatedNews' => $relatedNews
        ]);
    }
}
