/**
 * 文档上传 API
 * POST /api/admin/upload
 *
 * 上传 Word 文档，自动提取其中的信息作为长期记忆
 */

import { NextResponse } from 'next/server';
import {
  parseWordDocument,
  extractMemoriesFromDocument,
} from '@/lib/document/parser';
import { saveExtractedMemories } from '@/lib/memory/manager';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: '请选择一个文件上传' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '仅支持 Word 文档（.docx / .doc）格式' },
        { status: 400 }
      );
    }

    // 解析文档
    const fileBuffer = await file.arrayBuffer();
    const documentText = await parseWordDocument(fileBuffer);

    if (!documentText || documentText.trim().length === 0) {
      return NextResponse.json(
        { error: '文档中没有提取到文本内容' },
        { status: 400 }
      );
    }

    // 从文档中提取记忆
    const memoryInputs = await extractMemoriesFromDocument(
      documentText,
      file.name
    );

    if (memoryInputs.length === 0) {
      return NextResponse.json({
        success: true,
        message: '文档已解析，但没有提取到新的记忆信息',
        totalExtracted: 0,
        totalSaved: 0,
        preview: documentText.slice(0, 300) + '...',
      });
    }

    // 保存提取的记忆
    const savedCount = await saveExtractedMemories(memoryInputs);

    return NextResponse.json({
      success: true,
      message: `成功从文档中提取并保存了 ${savedCount} 条记忆`,
      totalExtracted: memoryInputs.length,
      totalSaved: savedCount,
      newFacts: memoryInputs.map((m) => m.content),
      preview: documentText.slice(0, 300) + '...',
    });
  } catch (error) {
    console.error('文档上传 API 出错:', error);
    return NextResponse.json(
      { error: '处理文档时出错，请确保上传的是有效的 Word 文档' },
      { status: 500 }
    );
  }
}
