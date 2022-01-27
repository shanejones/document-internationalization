import React from 'react'
import {
  Stack,
  Box,
  Flex,
  Dialog,
  Text,
  Card,
  Heading,
  Badge,
  Inline,
  Code,
  Button,
} from '@sanity/ui'
import {DocumentDiff} from '../../../types'
import {UiMessages} from '../../../constants'

type Props = {
  diffs: DocumentDiff[][]
  onConfirm?: (diffs: DocumentDiff[][]) => Promise<void>
  onClose?: () => void
}

export const MaintenanceTabDiffDialog: React.FC<Props> = ({diffs, onConfirm, onClose}) => {
  const [pending, setPending] = React.useState(false)
  const handleConfirm = React.useCallback(async () => {
    setPending(true)
    if (onConfirm) {
      try {
        await onConfirm(diffs)
      } catch (error) {
        console.error(error)
      }
    }
    setPending(false)
  }, [diffs, onConfirm])

  return (
    <Dialog
      id="diff-overview"
      width={[500]}
      header={UiMessages.translationsMaintenance.diffOverview.title}
      footer={
        <Flex padding={2} justify="flex-end">
          <Inline space={2}>
            <Button
              tone="primary"
              padding={[2, 3]}
              loading={pending}
              disabled={pending}
              onClick={handleConfirm}
            >
              {UiMessages.translationsMaintenance.diffOverview.confirm}
            </Button>
          </Inline>
        </Flex>
      }
      onClose={onClose}
    >
      <Box padding={4}>
        <Box marginBottom={4}>
          <Text>{UiMessages.translationsMaintenance.diffOverview.description}</Text>
        </Box>
        <Stack space={4}>
          {diffs.map((diff, index) => (
            <Card key={`${diff.id}-${index}`} padding={4} radius={2} shadow={1}>
              <Stack space={2}>
                <Box>
                  <Inline space={2}>
                    {diff.op === 'add' && <Badge tone="positive">{diff.op}</Badge>}
                    {diff.op === 'modify' && <Badge tone="caution">{diff.op}</Badge>}
                    {diff.op === 'remove' && <Badge tone="critical">{diff.op}</Badge>}
                    <Badge>{diff.type}</Badge>
                    <Heading as="h4" size={1}>
                      {diff.id}
                    </Heading>
                  </Inline>
                </Box>
                {diff.op === 'modify' && diff.patches.length && (
                  <Stack space={2}>
                    {diff.patches.map((patch, patchIndex) => (
                      <Card
                        key={`${diff.id}-${index}-${patchIndex}`}
                        padding={2}
                        radius={2}
                        shadow={1}
                        tone={
                          {
                            add: 'positive' as const,
                            remove: 'critical' as const,
                            replace: 'caution' as const,
                          }[patch.op]
                        }
                      >
                        {patch.op === 'add' && (
                          <Stack space={2}>
                            <Inline>
                              <Badge>{patch.path.replace(/\//g, '.')}</Badge>
                            </Inline>
                            <Code>{JSON.stringify(patch.value)}</Code>
                          </Stack>
                        )}
                      </Card>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>
    </Dialog>
  )
}
