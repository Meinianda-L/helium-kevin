'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Alert, Button, Card } from 'flowbite-react'
import { getFeishuAuthUrl } from '@/app/studio/settings/feishu-actions'
import { HiLink, HiCheckCircle } from 'react-icons/hi2'

export default function FeishuSettings({ user, searchParams }: { user: any, searchParams?: { success?: string, error?: string } }) {
  const [ authUrl, setAuthUrl ] = useState('')
  const [ isLinked ] = useState(!!user?.feishuOpenId)
  const [ feedback, setFeedback ] = useState<{ type: 'success' | 'failure', message: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    ;(async () => {
      setAuthUrl(await getFeishuAuthUrl())
    })()
  }, [])

  useEffect(() => {
    if (isLinked) {
      setFeedback({ type: 'success', message: '飞书账号已绑定。' })
      if (searchParams?.success || searchParams?.error) {
        router.replace(pathname)
      }
      return
    }

    if (searchParams?.success === 'linked') {
      setFeedback({ type: 'success', message: '飞书账号绑定成功。' })
      router.replace(pathname)
      return
    }

    if (searchParams?.error === 'feishu_auth_failed') {
      setFeedback({ type: 'failure', message: '飞书授权被取消或失败，请重试。' })
      router.replace(pathname)
      return
    }

    if (searchParams?.error === 'no_code') {
      setFeedback({ type: 'failure', message: '没有收到飞书授权 code。' })
      router.replace(pathname)
      return
    }

    if (searchParams?.error === 'linking_failed') {
      setFeedback({ type: 'failure', message: '飞书账号绑定失败，请检查应用配置。' })
      router.replace(pathname)
    }
  }, [ isLinked, pathname, router, searchParams ])

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">飞书设置</h1>

      {feedback ? (
        <Alert color={feedback.type === 'success' ? 'success' : 'failure'} className="mb-6">
          {feedback.message}
        </Alert>
      ) : null}

      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">飞书账号绑定</h2>
        <p className="text-gray-600 mb-4">
          绑定你的飞书账号后，当有页面需要审核时会收到飞书通知。
        </p>

        {isLinked ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <HiCheckCircle className="text-green-600 text-2xl" />
            <div>
              <p className="font-semibold text-green-900">已绑定飞书账号</p>
              <p className="text-sm text-green-700">当前账号已关联飞书通知。</p>
            </div>
          </div>
        ) : (
          <a href={authUrl}>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <HiLink className="mr-2" />
              绑定飞书账号
            </Button>
          </a>
        )}
      </Card>
    </div>
  )
}
