'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface HowToConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HowToConnectModal({ open, onOpenChange }: HowToConnectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">✨ How to Connect Your Social Accounts</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Why Connect Section */}
          <section className="space-y-3 border-l-4 border-primary/30 pl-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              🎯 Why Connect Your Accounts?
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg flex-shrink-0">✅</span>
                <span className="pt-0.5">
                  <strong>Post to all platforms at once</strong> (instead of posting separately on each one)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg flex-shrink-0">✅</span>
                <span className="pt-0.5">
                  <strong>See all your likes, comments, and followers in one place</strong>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg flex-shrink-0">✅</span>
                <span className="pt-0.5">
                  <strong>Let AI help write your captions</strong> (saves time!)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-lg flex-shrink-0">✅</span>
                <span className="pt-0.5">
                  <strong>Schedule posts</strong> (post even when you're sleeping!)
                </span>
              </li>
            </ul>
          </section>

          {/* Step 1 */}
          <section className="space-y-2 bg-primary/5 p-4 rounded-xl border border-primary/10">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl font-bold">1️⃣</span> Go to Settings
            </h3>
            <ol className="text-sm text-muted-foreground space-y-1 ml-7">
              <li>• Open the Netra AI app in your browser</li>
              <li>• Click your <strong>account icon</strong> (circle with your initial) in the top-right corner</li>
              <li>• Click <strong>"Settings"</strong></li>
              <li>• Click <strong>"Platforms"</strong> in the left menu</li>
            </ol>
            <p className="text-sm text-primary font-medium mt-2">
              👉 You should now see 4 colorful platform boxes! 🎨
            </p>
          </section>

          {/* Step 2 */}
          <section className="space-y-2 bg-primary/5 p-4 rounded-xl border border-primary/10">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl font-bold">2️⃣</span> Click "Connect" on Your First Platform
            </h3>
            <p className="text-sm text-muted-foreground ml-7 font-medium">Let's start with <strong>Instagram</strong> 📱:</p>
            <ol className="text-sm text-muted-foreground space-y-1 ml-7">
              <li>• Find the Instagram box (pink/purple colors)</li>
              <li>• Click the blue <strong>"Connect"</strong> button</li>
              <li>• You'll be taken to <strong>Instagram's login page</strong> (looks like the normal Instagram app)</li>
              <li>• <strong>Sign in with your Instagram account</strong> (if not already signed in)</li>
              <li>• Instagram will ask: <em>"Does Netra AI want to access your account?"</em></li>
              <li>• Click <strong>"Allow"</strong> or <strong>"Yes"</strong> (don't be scared — this is normal!)</li>
              <li>• <strong>Magic happens!</strong> ✨ You'll be sent back to the Netra AI app</li>
              <li>• A <strong>green checkmark ✅</strong> will appear next to Instagram</li>
              <li>• You'll see a <strong>"Success!" message</strong> at the top</li>
            </ol>
            <p className="text-sm text-primary font-medium mt-2">
              🔄 <strong>Repeat this process for TikTok, YouTube, and X</strong> (same steps for each!)
            </p>
          </section>

          {/* Step 3 */}
          <section className="space-y-2 bg-primary/5 p-4 rounded-xl border border-primary/10">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="text-primary text-xl font-bold">3️⃣</span> You're Done! 🎉
            </h3>
            <p className="text-sm text-muted-foreground ml-7">All 4 platforms now show <strong>green checkmarks ✅</strong>. You can now:</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-7">
              <li>✅ Post to all platforms at the same time</li>
              <li>✅ See analytics and comments from all your accounts</li>
              <li>✅ Use AI to write captions</li>
            </ul>
          </section>

          {/* Troubleshooting */}
          <section className="space-y-2 border-t pt-4">
            <h2 className="text-lg font-semibold text-foreground">🚨 What If Something Goes Wrong?</h2>
            <div className="space-y-2">
              {/* Problem 1 */}
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-sm font-medium text-foreground hover:text-primary p-0 h-auto">
                    <ChevronDown className="mr-2 h-4 w-4 transition-transform" />
                    Problem: "The button isn't doing anything"
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded mt-2 ml-6">
                  <p className="font-medium text-foreground mb-1">💡 Solution:</p>
                  <p>Wait 2 seconds. Sometimes the connection is slow.</p>
                </CollapsibleContent>
              </Collapsible>

              {/* Problem 2 */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-sm font-medium text-foreground hover:text-primary p-0 h-auto">
                    <ChevronDown className="mr-2 h-4 w-4 transition-transform" />
                    Problem: "It says I need to log in first"
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded mt-2 ml-6">
                  <p className="font-medium text-foreground mb-1">💡 Solution:</p>
                  <p>That's correct! Just log in with your username and password. This is the same as logging into Instagram on your phone.</p>
                </CollapsibleContent>
              </Collapsible>

              {/* Problem 3 */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-sm font-medium text-foreground hover:text-primary p-0 h-auto">
                    <ChevronDown className="mr-2 h-4 w-4 transition-transform" />
                    Problem: "It asks for permission and I'm scared to click 'Allow'"
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded mt-2 ml-6">
                  <p className="font-medium text-foreground mb-1">💡 Solution:</p>
                  <p>This is totally safe! Netra AI is asking permission so it can help you post. Without permission, it can't do anything. It's like asking your parent's permission to use their credit card (you're just saying "yes, you can help").</p>
                </CollapsibleContent>
              </Collapsible>

              {/* Problem 4 */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-sm font-medium text-foreground hover:text-primary p-0 h-auto">
                    <ChevronDown className="mr-2 h-4 w-4 transition-transform" />
                    Problem: "I clicked 'Connect' but nothing happened"
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded mt-2 ml-6">
                  <p className="font-medium text-foreground mb-1">💡 Solution:</p>
                  <ol className="space-y-1 list-decimal list-inside">
                    <li>Check that you're <strong>not already logged into</strong> that platform in another tab</li>
                    <li>Try <strong>closing all other tabs</strong> of that social media app</li>
                    <li>Click "Connect" again</li>
                    <li>If still stuck, refresh the page (press F5) and try again</li>
                  </ol>
                </CollapsibleContent>
              </Collapsible>

              {/* Problem 5 */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-sm font-medium text-foreground hover:text-primary p-0 h-auto">
                    <ChevronDown className="mr-2 h-4 w-4 transition-transform" />
                    Problem: "I want to disconnect an account"
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded mt-2 ml-6">
                  <p className="font-medium text-foreground mb-1">💡 Solution:</p>
                  <p>Click the <strong>"Disconnect"</strong> button next to that platform. No data is deleted — you can always reconnect later!</p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </section>

          {/* Success Criteria */}
          <section className="space-y-3 bg-green-50 dark:bg-green-950/20 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
            <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
              ✅ You'll Know It Worked When:
            </h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-1 ml-6">
              <li>• All 4 platforms show green checkmarks ✅</li>
              <li>• You see platform names under each box (like "@your_instagram_handle")</li>
              <li>• The "Connect" buttons changed to "Disconnect" buttons</li>
              <li>• You see a success message: "Instagram connected!"</li>
            </ul>
          </section>
        </div>

        {/* Footer Button */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Got it! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
