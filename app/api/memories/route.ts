/**
 * 记忆管理 API
 * GET    /api/memories        - 获取所有记忆
 * POST   /api/memories        - 手动创建记忆
 * DELETE /api/memories?id=xxx - 删除指定记忆
 * PUT    /api/memories        - 更新记忆
 */

import { NextResponse } from 'next/server';
import {
  getAllMemories,
  getMemoriesByCategory,
  createMemory,
  updateMemory,
  deleteMemory,
  getMemoryCount,
} from '@/lib/memory/store';
import type { CreateMemoryInput, MemoryCategory } from '@/lib/memory/types';

/**
 * 获取记忆列表
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    // 获取单条记忆
    if (id) {
      const memories = await getAllMemories();
      const memory = memories.find((m) => m.id === id);
      if (!memory) {
        return NextResponse.json(
          { error: '记忆不存在' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, memory });
    }

    // 按分类获取
    if (category) {
      const memories = await getMemoriesByCategory(category);
      return NextResponse.json({
        success: true,
        memories,
        total: memories.length,
      });
    }

    // 获取全部
    const memories = await getAllMemories();
    const count = await getMemoryCount();

    return NextResponse.json({
      success: true,
      memories,
      total: count,
    });
  } catch (error) {
    console.error('获取记忆出错:', error);
    return NextResponse.json(
      { error: '获取记忆失败' },
      { status: 500 }
    );
  }
}

/**
 * 创建新记忆
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, category, tags, importance } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: '记忆内容不能为空' },
        { status: 400 }
      );
    }

    const input: CreateMemoryInput = {
      content,
      category: (category as MemoryCategory) || 'other',
      tags: Array.isArray(tags) ? tags : [],
      source: 'manual',
      importance: typeof importance === 'number' ? importance : 0.5,
    };

    const memory = await createMemory(input);

    return NextResponse.json({
      success: true,
      memory,
    });
  } catch (error) {
    console.error('创建记忆出错:', error);
    return NextResponse.json(
      { error: '创建记忆失败' },
      { status: 500 }
    );
  }
}

/**
 * 更新记忆
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, content, category, tags, importance } = body;

    if (!id) {
      return NextResponse.json(
        { error: '记忆 ID 不能为空' },
        { status: 400 }
      );
    }

    const updated = await updateMemory(id, {
      content,
      category: category as MemoryCategory | undefined,
      tags,
      importance,
    });

    if (!updated) {
      return NextResponse.json(
        { error: '记忆不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      memory: updated,
    });
  } catch (error) {
    console.error('更新记忆出错:', error);
    return NextResponse.json(
      { error: '更新记忆失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除记忆
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '记忆 ID 不能为空' },
        { status: 400 }
      );
    }

    const deleted = await deleteMemory(id);

    if (!deleted) {
      return NextResponse.json(
        { error: '记忆不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '记忆已删除',
    });
  } catch (error) {
    console.error('删除记忆出错:', error);
    return NextResponse.json(
      { error: '删除记忆失败' },
      { status: 500 }
    );
  }
}
