#!/usr/bin/env ruby

require 'yaml'
require 'fileutils'
require 'date'

# Script to automatically generate tag pages for Jekyll
class TagPageGenerator
  def initialize(source_dir = '.')
    @source_dir = source_dir
    @posts_dir = File.join(@source_dir, '_posts')
    @tags_dir = File.join(@source_dir, '_tags')
  end

  def generate
    # Ensure _tags directory exists
    FileUtils.mkdir_p(@tags_dir)
    
    # Get all tags from posts
    tags = collect_tags_from_posts
    
    # Get existing tag pages
    existing_tags = get_existing_tag_pages
    
    # Generate pages for new tags
    new_tags = tags - existing_tags
    if new_tags.any?
      puts "🏷️  Creating #{new_tags.size} new tag pages..."
      new_tags.each { |tag| create_tag_page(tag) }
    end
    
    # Clean up pages for tags that no longer exist
    obsolete_tags = existing_tags - tags
    if obsolete_tags.any?
      puts "🗑️  Removing #{obsolete_tags.size} obsolete tag pages..."
      obsolete_tags.each { |tag| remove_tag_page(tag) }
    end
    
    if new_tags.empty? && obsolete_tags.empty?
      puts "✅ All tag pages are up to date!"
    else
      puts "✨ Tag page generation complete!"
    end
  end

  private

  def collect_tags_from_posts
    tags = Set.new
    
    Dir.glob(File.join(@posts_dir, '**', '*.md')).each do |post_file|
      begin
        content = File.read(post_file)
        if content =~ /\A---\s*\n(.*?)\n---\s*\n/m
          frontmatter = YAML.safe_load($1, permitted_classes: [Date])
          if frontmatter && frontmatter['tags']
            post_tags = frontmatter['tags']
            post_tags = [post_tags] if post_tags.is_a?(String)
            post_tags.each { |tag| tags.add(tag.to_s.strip) } if post_tags.is_a?(Array)
          end
        end
      rescue => e
        puts "⚠️  Error reading #{post_file}: #{e.message}"
      end
    end
    
    tags.to_a.reject(&:empty?)
  end

  def get_existing_tag_pages
    existing_tags = Set.new
    
    Dir.glob(File.join(@tags_dir, '*.md')).each do |tag_file|
      begin
        content = File.read(tag_file)
        if content =~ /\A---\s*\n(.*?)\n---\s*\n/m
          frontmatter = YAML.safe_load($1, permitted_classes: [Date])
          if frontmatter && frontmatter['tag']
            existing_tags.add(frontmatter['tag'].to_s.strip)
          end
        end
      rescue => e
        puts "⚠️  Error reading #{tag_file}: #{e.message}"
      end
    end
    
    existing_tags.to_a
  end

  def create_tag_page(tag)
    filename = "#{tag.downcase.gsub(/[^a-z0-9\-_]/, '-').gsub(/-+/, '-')}.md"
    filepath = File.join(@tags_dir, filename)
    
    content = <<~CONTENT
      ---
      layout: tag
      tag: #{tag}
      title: "##{tag}"
      permalink: /tags/#{tag.downcase.gsub(/[^a-z0-9\-_]/, '-').gsub(/-+/, '-')}/
      ---
    CONTENT
    
    File.write(filepath, content)
  end

  def remove_tag_page(tag)
    Dir.glob(File.join(@tags_dir, '*.md')).each do |tag_file|
      begin
        content = File.read(tag_file)
        if content =~ /\A---\s*\n(.*?)\n---\s*\n/m
          frontmatter = YAML.safe_load($1, permitted_classes: [Date])
          if frontmatter && frontmatter['tag'] == tag
            File.delete(tag_file)
            break
          end
        end
      rescue => e
        puts "⚠️  Error processing #{tag_file}: #{e.message}"
      end
    end
  end
end

# Run the generator if this script is executed directly
if __FILE__ == $0
  require 'set'
  generator = TagPageGenerator.new
  generator.generate
end 